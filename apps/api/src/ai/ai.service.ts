import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface GenerateJobRequest {
  prompt: string;
  style: string;
  width: number;
  height: number;
  designId: string;
}

export interface GenerateJobResponse {
  jobId: string;
  status: string;
}

export interface JobStatusResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  imageUrl?: string;
  error?: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const baseURL = this.configService.get<string>(
      'FASTAPI_URL',
      'http://localhost:8000',
    );

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async submitGenerationJob(
    request: GenerateJobRequest,
  ): Promise<GenerateJobResponse> {
    try {
      const response = await this.client.post<GenerateJobResponse>(
        '/generate',
        request,
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to submit generation job to FastAPI', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? HttpStatus.BAD_GATEWAY;
        const message =
          error.response?.data?.detail ?? 'AI service unavailable';
        throw new HttpException(message, status);
      }
      throw new HttpException(
        'Failed to communicate with AI service',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async analyzeImage(imageUrl: string): Promise<string[]> {
    try {
      const response = await this.client.post<{ tags: string[] }>('/analyze', {
        image_url: imageUrl,
      });
      return response.data?.tags ?? [];
    } catch (error) {
      this.logger.error('Failed to analyze image via FastAPI', error);
      return [];
    }
  }

  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    try {
      const response = await this.client.get<JobStatusResponse>(
        `/jobs/${jobId}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get job status for ${jobId}`, error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? HttpStatus.BAD_GATEWAY;
        const message =
          error.response?.data?.detail ?? 'AI service unavailable';
        throw new HttpException(message, status);
      }
      throw new HttpException(
        'Failed to communicate with AI service',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
