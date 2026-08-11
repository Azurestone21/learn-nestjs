import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OSS from 'ali-oss';
import path from 'path';

@Injectable()
export class UploadService {
  private readonly ossClient: OSS;
  private readonly bucket: string;
  private readonly region: string;
  private readonly folder: string;
  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('OSS_BUCKET') || '';
    this.region = this.configService.get<string>('OSS_REGION') || '';
    this.folder = this.configService.get<string>('OSS_FOLDER') || '';
    this.ossClient = new OSS({
      accessKeyId: this.configService.get<string>('OSS_ACCESS_KEY_ID') || '',
      accessKeySecret: this.configService.get<string>('OSS_ACCESS_KEY_SECRET') || '',
      bucket: this.bucket,
      region: this.region,
      authorizationV4: true, // 推荐使用 V4 签名
      timeout: 60000,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname);
    const baseName = Date.now();
    const fileName = `${baseName}${ext}`;
    const ossPath = `${this.folder}/${fileName}`;

    // 优先使用 buffer（内存），否则使用文件路径
    const content = file.buffer || file.path;
    const result = await this.ossClient.put(ossPath, content);
    return result.url;
  }
}
