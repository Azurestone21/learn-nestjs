import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Cat } from '../interfaces/cat.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatDto implements Omit<Cat, 'id'> {
  @ApiProperty({
    example: 'Tom',
    description: '名称',
  })
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString({ message: '名称必须是字符串' })
  @MaxLength(10, { message: '名称最多10个字符' })
  name: string;

  @ApiProperty({
    example: 3,
    description: '年龄',
  })
  @IsNotEmpty({ message: '年龄不能为空' })
  @IsNumber({}, { message: '年龄必须是数字' })
  age: number;

  @ApiProperty({
    example: 1,
    description: '性别',
    required: false,
  })
  @IsNumber({}, { message: '性别必须是数字' })
  sex?: number;
}
