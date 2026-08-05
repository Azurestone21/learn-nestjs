import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
  @Column()
  name: string;

  @ApiProperty({
    description: '年龄',
    example: 18,
  })
  @Column()
  age?: number;

  @ApiProperty({
    description: '性别',
    example: 1,
    enum: [1, 2],
  })
  @Column()
  sex?: number;
}
