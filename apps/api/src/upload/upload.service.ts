import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  validateFile(file: Express.Multer.File): void {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds the 10MB limit');
    }
  }

  async saveFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<{ filePath: string; imageUrl: string }> {
    const userDir = path.join(process.cwd(), 'uploads', userId);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${timestamp}-${sanitizedFilename}`;
    const filePath = path.join(userDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    this.logger.log(`Saved uploaded file to ${filePath}`);

    const imageUrl = `/uploads/${userId}/${filename}`;

    return { filePath, imageUrl };
  }
}
