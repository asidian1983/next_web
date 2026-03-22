import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  async listCollections(@Request() req: AuthenticatedRequest) {
    return this.collectionsService.listCollections(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCollection(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateCollectionDto,
  ) {
    return this.collectionsService.createCollection(req.user.id, dto);
  }

  @Get(':id')
  async getCollection(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.collectionsService.getCollection(
      req.user.id,
      id,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Patch(':id')
  async updateCollection(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    return this.collectionsService.updateCollection(req.user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCollection(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.collectionsService.deleteCollection(req.user.id, id);
  }

  @Post(':id/designs')
  @HttpCode(HttpStatus.CREATED)
  async addDesignToCollection(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body('designId') designId: string,
  ) {
    return this.collectionsService.addDesignToCollection(req.user.id, id, designId);
  }

  @Delete(':id/designs/:designId')
  @HttpCode(HttpStatus.OK)
  async removeDesignFromCollection(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('designId') designId: string,
  ) {
    return this.collectionsService.removeDesignFromCollection(req.user.id, id, designId);
  }
}
