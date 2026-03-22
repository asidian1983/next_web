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
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { DesignsService } from './designs.service';
import { GenerateDesignDto } from './dto/generate-design.dto';
import { BatchGenerateDto } from './dto/batch-generate.dto';
import { UploadDesignDto } from './dto/upload-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { QueryDesignsDto } from './dto/query-designs.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from '../ai/ai.service';

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
  constructor(
    private readonly designsService: DesignsService,
    private readonly aiService: AiService,
  ) {}

  // 1. GET /designs/stats — must be before :id routes
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getGenerationStats(@Request() req: AuthenticatedRequest) {
    return this.designsService.getGenerationStats(req.user.id);
  }

  // 2. GET /designs/public — no auth required
  @Get('public')
  async getPublicDesigns(@Query() query: QueryDesignsDto) {
    return this.designsService.getPublicDesigns(query);
  }

  // 3. GET /designs/favorites
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

  // 4. GET /designs/generate/:jobId/stream — SSE proxy
  @Get('generate/:jobId/stream')
  @UseGuards(JwtAuthGuard)
  async streamJobStatus(
    @Param('jobId') jobId: string,
    @Res({ passthrough: false }) res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const upstream = await this.aiService.streamJobStatus(jobId);
    const stream: NodeJS.ReadableStream = upstream.data as NodeJS.ReadableStream;

    stream.on('data', (chunk: Buffer) => {
      res.write(chunk);
    });

    stream.on('end', () => {
      res.end();
    });

    stream.on('error', () => {
      res.write('data: {"status":"failed","error":"stream error"}\n\n');
      res.end();
    });

    res.on('close', () => {
      stream.destroy?.();
    });
  }

  // 5. GET /designs/job/:jobId
  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard)
  async getJobStatus(
    @Request() req: AuthenticatedRequest,
    @Param('jobId') jobId: string,
  ) {
    return this.designsService.getJobStatus(req.user.id, jobId);
  }

  // 6. GET /designs/:id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getDesign(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.designsService.getDesign(req.user.id, id);
  }

  // 7. GET /designs
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

  @Post('generate/batch')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async generateBatch(
    @Request() req: AuthenticatedRequest,
    @Body() dto: BatchGenerateDto,
  ) {
    return this.designsService.generateBatch(dto, req.user.id);
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
