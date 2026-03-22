import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DesignsService } from './designs.service';
import { GenerateDesignDto } from './dto/generate-design.dto';
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
@UseGuards(JwtAuthGuard)
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  @Get()
  async listDesigns(
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.designsService.listDesigns(
      req.user.id,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Post('generate')
  async generateDesign(
    @Request() req: AuthenticatedRequest,
    @Body() dto: GenerateDesignDto,
  ) {
    return this.designsService.generateDesign(req.user.id, dto);
  }

  @Get('job/:jobId')
  async getJobStatus(
    @Request() req: AuthenticatedRequest,
    @Param('jobId') jobId: string,
  ) {
    return this.designsService.getJobStatus(req.user.id, jobId);
  }

  @Get(':id')
  async getDesign(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.designsService.getDesign(req.user.id, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteDesign(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.designsService.deleteDesign(req.user.id, id);
  }
}
