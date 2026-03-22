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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DesignsService } from './designs.service';
import { GenerateDesignDto } from './dto/generate-design.dto';
import { UploadDesignDto } from './dto/upload-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { QueryDesignsDto } from './dto/query-designs.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

@Controller('designs')
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  // Public route — no auth required. Must be declared before :id routes.
  @Get('public')
  async getPublicDesigns(@Query() query: QueryDesignsDto) {
    return this.designsService.getPublicDesigns(query);
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  async getFavoriteDesigns(
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.designsService.getFavoriteDesigns(
      req.user.id,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async listDesigns(
    @Request() req: AuthenticatedRequest,
    @Query() query: QueryDesignsDto,
  ) {
    return this.designsService.listDesigns(req.user.id, query);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadDesign(
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDesignDto,
  ) {
    return this.designsService.uploadDesign(file, dto, req.user.id);
  }

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateDesign(
    @Request() req: AuthenticatedRequest,
    @Body() dto: GenerateDesignDto,
  ) {
    return this.designsService.generateDesign(req.user.id, dto);
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard)
  async getJobStatus(
    @Request() req: AuthenticatedRequest,
    @Param('jobId') jobId: string,
  ) {
    return this.designsService.getJobStatus(req.user.id, jobId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getDesign(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.designsService.getDesign(req.user.id, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateDesign(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateDesignDto,
  ) {
    return this.designsService.updateDesign(req.user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteDesign(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.designsService.deleteDesign(req.user.id, id);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async toggleFavorite(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.designsService.toggleFavorite(req.user.id, id);
  }
}
