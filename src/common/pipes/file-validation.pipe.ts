import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

export interface FileValidationOptions {
  maxSize: number; // 文件最大大小，单位字节
  allowedMimeTypes?: string[]; // 允许的文件类型，例如：image/jpeg, image/png, application/pdf
  required?: boolean; // 是否必须上传文件，默认false
}

/**
 * 文件验证管道
 */
@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions) {}

  transform(file: Express.Multer.File, metadata: ArgumentMetadata): any {
    if (!file) {
      if (this.options.required) {
        throw new BadRequestException('文件不能为空');
      }
      return null;
    }
    if (file.size > this.options.maxSize) {
      const maxKB = this.options.maxSize / 1024 / 1024;
      throw new BadRequestException(`文件大小不能超过 ${maxKB} MB`);
    }

    // console.log('🚀 ~ FileValidationPipe ~ transform ~ file:', file);
    if (
      this.options.allowedMimeTypes &&
      !this.options.allowedMimeTypes?.includes(file.mimetype)
    ) {
      throw new BadRequestException(
        `不支持的文件格式，请上传: ${this.options.allowedMimeTypes?.map((item) => item.split('/').pop()).join(', ')}`,
      );
    }

    return file;
  }
}
