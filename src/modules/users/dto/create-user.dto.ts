import { IsNotEmpty, IsNumber } from "class-validator";

import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * 创建用户DTO
 */
export class CreateUserDto {
  @ApiProperty({
    description: '用户名称',
    example: '小明',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: '用户年龄',
    example: 18,
    required: false,
  })
  @IsNumber()
  age?: number;

  @ApiProperty({
    description: '用户性别',
    example: 1,
    enum: [1, 2],
    required: false,
  })
  @IsNumber()
  sex?: number;
}
