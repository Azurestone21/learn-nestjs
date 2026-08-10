import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  uploadFile(file: Express.Multer.File): string {
    return file.originalname;
  }
}
