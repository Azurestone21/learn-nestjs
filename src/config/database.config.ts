import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USER', 'root'),
  password: configService.get<string>('DB_PASSWORD', ''),
  database: configService.get<string>('DB_NAME', 'test'),
  // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  autoLoadEntities: true, // 自动加载实体
  // 生产环境务必设为 false，使用迁移管理表结构
  synchronize: configService.get<string>('NODE_ENV') === 'development',
  // 可选的额外配置
  logging: configService.get<string>('NODE_ENV') === 'development',
  timezone: '+08:00',
});
