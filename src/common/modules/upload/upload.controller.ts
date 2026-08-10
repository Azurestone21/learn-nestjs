import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/common/pipes/file-validation.pipe';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/files')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new FileValidationPipe({
        maxSize: 10 * 1024 * 1024, // 10MB
        required: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    // console.log('🚀 ~ UploadController ~ uploadFile ~ file:', file);
    return this.uploadService.uploadFile(file);
  }
}
