import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listCollections(userId: string) {
    const collections = await this.prisma.collection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { designs: true } },
      },
    });

    return {
      data: { items: collections, total: collections.length },
      message: 'Collections retrieved successfully',
    };
  }

  async createCollection(userId: string, dto: CreateCollectionDto) {
    const collection = await this.prisma.collection.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        userId,
      },
    });

    return {
      data: collection,
      message: 'Collection created successfully',
    };
  }

  async getCollection(userId: string, collectionId: string, page = 1, limit = 10) {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const skip = (page - 1) * limit;

    const [designCollections, total] = await Promise.all([
      this.prisma.designCollection.findMany({
        where: { collectionId },
        orderBy: { addedAt: 'desc' },
        skip,
        take: limit,
        include: { design: true },
      }),
      this.prisma.designCollection.count({ where: { collectionId } }),
    ]);

    const designs = designCollections.map((dc) => dc.design);

    return {
      data: {
        ...collection,
        designs: { items: designs, total, page, limit },
      },
      message: 'Collection retrieved successfully',
    };
  }

  async updateCollection(userId: string, collectionId: string, dto: UpdateCollectionDto) {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updated = await this.prisma.collection.update({
      where: { id: collectionId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });

    return {
      data: updated,
      message: 'Collection updated successfully',
    };
  }

  async deleteCollection(userId: string, collectionId: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.collection.delete({ where: { id: collectionId } });

    return {
      data: null,
      message: 'Collection deleted successfully',
    };
  }

  async addDesignToCollection(userId: string, collectionId: string, designId: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const design = await this.prisma.design.findUnique({
      where: { id: designId },
    });

    if (!design) {
      throw new NotFoundException('Design not found');
    }

    const existing = await this.prisma.designCollection.findUnique({
      where: { designId_collectionId: { designId, collectionId } },
    });

    if (existing) {
      throw new ConflictException('Design already in collection');
    }

    await this.prisma.designCollection.create({
      data: { designId, collectionId },
    });

    return {
      data: null,
      message: 'Design added to collection successfully',
    };
  }

  async removeDesignFromCollection(userId: string, collectionId: string, designId: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const existing = await this.prisma.designCollection.findUnique({
      where: { designId_collectionId: { designId, collectionId } },
    });

    if (!existing) {
      throw new NotFoundException('Design not in collection');
    }

    await this.prisma.designCollection.delete({
      where: { designId_collectionId: { designId, collectionId } },
    });

    return {
      data: null,
      message: 'Design removed from collection successfully',
    };
  }
}
