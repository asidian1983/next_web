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
import { UploadDesignDto } from './dto/upload-design.dto';
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

  async listDesigns(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [designs, total] = await Promise.all([
      this.prisma.design.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.design.count({ where: { userId } }),
    ]);

    return {
      data: designs,
      message: 'Designs retrieved successfully',
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
}
