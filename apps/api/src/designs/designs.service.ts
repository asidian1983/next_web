import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { UploadService } from '../upload/upload.service';
import { GenerateDesignDto } from './dto/generate-design.dto';
import { BatchGenerateDto } from './dto/batch-generate.dto';
import { UploadDesignDto } from './dto/upload-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { QueryDesignsDto } from './dto/query-designs.dto';
import { DesignStatus } from '@prisma/client';

@Injectable()
export class DesignsService {
  private readonly logger = new Logger(DesignsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly uploadService: UploadService,
  ) {}

  async uploadDesign(
    file: Express.Multer.File,
    dto: UploadDesignDto,
    userId: string,
  ) {
    this.uploadService.validateFile(file);

    const { imageUrl } = await this.uploadService.saveFile(file, userId);

    const tags = await this.aiService.analyzeImage(imageUrl);

    const design = await this.prisma.design.create({
      data: {
        prompt: '',
        title: dto.title ?? null,
        source: 'uploaded',
        imageUrl,
        tags,
        status: DesignStatus.DONE,
        userId,
      },
    });

    return {
      data: design,
      message: 'Design uploaded successfully',
    };
  }

  async listDesigns(userId: string, query: QueryDesignsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { prompt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.tags && query.tags.length > 0) {
      where.tags = { hasSome: query.tags };
    }

    if (query.style) {
      where.style = query.style;
    }

    if (query.source) {
      where.source = query.source;
    }

    const [designs, total] = await Promise.all([
      this.prisma.design.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.design.count({ where }),
    ]);

    return {
      data: { items: designs, total, page, limit },
      message: 'Designs retrieved successfully',
    };
  }

  async generateDesign(userId: string, dto: GenerateDesignDto) {
    const design = await this.prisma.design.create({
      data: {
        prompt: dto.prompt,
        style: dto.style ?? 'realistic',
        width: dto.width ?? 512,
        height: dto.height ?? 512,
        userId,
        status: DesignStatus.PENDING,
      },
    });

    try {
      const job = await this.aiService.submitGenerationJob({
        prompt: design.prompt,
        style: design.style,
        width: design.width,
        height: design.height,
        designId: design.id,
      });

      const updated = await this.prisma.design.update({
        where: { id: design.id },
        data: {
          jobId: job.jobId,
          status: DesignStatus.PROCESSING,
        },
      });

      return {
        data: updated,
        message: 'Design generation started',
      };
    } catch (error) {
      await this.prisma.design.update({
        where: { id: design.id },
        data: { status: DesignStatus.FAILED },
      });

      this.logger.error(`Failed to submit design ${design.id} to AI`, error);
      throw error;
    }
  }

  async getDesign(userId: string, designId: string) {
    const design = await this.prisma.design.findUnique({
      where: { id: designId },
    });

    if (!design) {
      throw new NotFoundException('Design not found');
    }

    if (design.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      data: design,
      message: 'Design retrieved successfully',
    };
  }

  async updateDesign(userId: string, designId: string, dto: UpdateDesignDto) {
    const design = await this.prisma.design.findUnique({
      where: { id: designId },
    });

    if (!design) {
      throw new NotFoundException('Design not found');
    }

    if (design.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updated = await this.prisma.design.update({
      where: { id: designId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
        ...(dto.style !== undefined && { style: dto.style }),
      },
    });

    return {
      data: updated,
      message: 'Design updated successfully',
    };
  }

  async deleteDesign(userId: string, designId: string) {
    const design = await this.prisma.design.findUnique({
      where: { id: designId },
    });

    if (!design) {
      throw new NotFoundException('Design not found');
    }

    if (design.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.design.delete({ where: { id: designId } });

    return {
      data: null,
      message: 'Design deleted successfully',
    };
  }

  async getJobStatus(userId: string, jobId: string) {
    const design = await this.prisma.design.findFirst({
      where: { jobId, userId },
    });

    if (!design) {
      throw new NotFoundException('Job not found');
    }

    const jobStatus = await this.aiService.getJobStatus(jobId);

    if (jobStatus.status === 'done' && jobStatus.imageUrl) {
      await this.prisma.design.update({
        where: { id: design.id },
        data: {
          status: DesignStatus.DONE,
          imageUrl: jobStatus.imageUrl,
        },
      });
    } else if (jobStatus.status === 'failed') {
      await this.prisma.design.update({
        where: { id: design.id },
        data: { status: DesignStatus.FAILED },
      });
    }

    return {
      data: {
        jobId,
        status: jobStatus.status,
        imageUrl: jobStatus.imageUrl ?? null,
        designId: design.id,
      },
      message: 'Job status retrieved',
    };
  }

  async toggleFavorite(userId: string, designId: string) {
    const design = await this.prisma.design.findUnique({
      where: { id: designId },
    });

    if (!design) {
      throw new NotFoundException('Design not found');
    }

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_designId: { userId, designId } },
    });

    let isFavorited: boolean;

    if (existing) {
      await this.prisma.favorite.delete({
        where: { userId_designId: { userId, designId } },
      });
      await this.prisma.design.update({
        where: { id: designId },
        data: { likesCount: { decrement: 1 } },
      });
      isFavorited = false;
    } else {
      await this.prisma.favorite.create({
        data: { userId, designId },
      });
      await this.prisma.design.update({
        where: { id: designId },
        data: { likesCount: { increment: 1 } },
      });
      isFavorited = true;
    }

    const updated = await this.prisma.design.findUnique({
      where: { id: designId },
      select: { likesCount: true },
    });

    return {
      data: { isFavorited, likesCount: updated!.likesCount },
      message: isFavorited ? 'Design favorited' : 'Design unfavorited',
    };
  }

  async getPublicDesigns(query: QueryDesignsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { isPublic: true };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { prompt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.tags && query.tags.length > 0) {
      where.tags = { hasSome: query.tags };
    }

    if (query.style) {
      where.style = query.style;
    }

    if (query.source) {
      where.source = query.source;
    }

    const [designs, total] = await Promise.all([
      this.prisma.design.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true } },
        },
      }),
      this.prisma.design.count({ where }),
    ]);

    return {
      data: { items: designs, total, page, limit },
      message: 'Public designs retrieved successfully',
    };
  }

  async getFavoriteDesigns(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { design: true },
      }),
      this.prisma.favorite.count({ where: { userId } }),
    ]);

    const designs = favorites.map((f) => f.design);

    return {
      data: { items: designs, total, page, limit },
      message: 'Favorite designs retrieved successfully',
    };
  }

  async generateBatch(dto: BatchGenerateDto, userId: string) {
    const designs = await Promise.all(
      dto.prompts.map((item) =>
        this.prisma.design.create({
          data: {
            prompt: item.prompt,
            style: item.style ?? 'realistic',
            width: item.width ?? 512,
            height: item.height ?? 512,
            userId,
            status: DesignStatus.PENDING,
          },
        }),
      ),
    );

    try {
      const batchResult = await this.aiService.batchGenerate(
        designs.map((d) => ({
          prompt: d.prompt,
          style: d.style,
          width: d.width,
          height: d.height,
          designId: d.id,
        })),
      );

      const jobMap = new Map(
        batchResult.jobs.map((j) => [j.designId, j.jobId]),
      );

      const updated = await Promise.all(
        designs.map((d) => {
          const jobId = jobMap.get(d.id);
          return this.prisma.design.update({
            where: { id: d.id },
            data: {
              jobId: jobId ?? null,
              status: jobId ? DesignStatus.PROCESSING : DesignStatus.FAILED,
            },
          });
        }),
      );

      return {
        data: { jobs: updated },
        message: 'Batch generation started',
      };
    } catch (error) {
      await Promise.all(
        designs.map((d) =>
          this.prisma.design.update({
            where: { id: d.id },
            data: { status: DesignStatus.FAILED },
          }),
        ),
      );

      this.logger.error('Failed to submit batch generation to AI', error);
      throw error;
    }
  }

  async getGenerationStats(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, byStatusRaw, bySourceRaw, thisMonth] = await Promise.all([
      this.prisma.design.count({ where: { userId } }),
      this.prisma.design.groupBy({
        by: ['status'],
        where: { userId },
        _count: { _all: true },
      }),
      this.prisma.design.groupBy({
        by: ['source'],
        where: { userId },
        _count: { _all: true },
      }),
      this.prisma.design.count({
        where: { userId, createdAt: { gte: startOfMonth } },
      }),
    ]);

    const byStatus = {
      done: 0,
      failed: 0,
      pending: 0,
      processing: 0,
    };

    for (const row of byStatusRaw) {
      const key = row.status.toLowerCase() as keyof typeof byStatus;
      if (key in byStatus) {
        byStatus[key] = row._count._all;
      }
    }

    const bySource: Record<string, number> = {};
    for (const row of bySourceRaw) {
      if (row.source) {
        bySource[row.source] = row._count._all;
      }
    }

    return {
      data: {
        total,
        byStatus,
        bySource: {
          generated: bySource['generated'] ?? 0,
          uploaded: bySource['uploaded'] ?? 0,
        },
        thisMonth,
      },
      message: 'Generation stats retrieved successfully',
    };
  }
}
