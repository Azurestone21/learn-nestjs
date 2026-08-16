import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 用户实体
 * 使用ORM时@Entity必须有，否则TypeOrmModule.forFeature无法获取到User
 * name可以定义数据库表名
 */
@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    description: 'ID',
    example: 1,
  })
  @PrimaryGeneratedColumn() // 主键，自增
  id: number;

  @ApiProperty({
    description: '名称',
    example: '小明',
  })
  @Column({ default: '' })
  nickname?: string;

  @ApiProperty({
    description: '年龄',
    example: 18,
  })
  @Column({ nullable: true })
  age?: number;

  @ApiProperty({
    description: '性别',
    example: 1,
    enum: [1, 2],
  })
  @Column({ nullable: true })
  sex?: number;

  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  @Column()
  username: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: '用户角色',
    example: Role.Admin,
    enum: [Role.Admin, Role.User],
  })
  @Column({ default: Role.User })
  role?: Role;

  @ApiProperty({
    description: '创建时间',
    example: '2023-01-01 00:00:00',
  })
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
