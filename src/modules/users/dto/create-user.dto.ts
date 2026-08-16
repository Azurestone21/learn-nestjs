import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/common/enums/role.enum";

/**
 * 创建用户DTO
 */
export class CreateUserDto {
  @ApiProperty({
    description: '用户昵称',
    example: '小明',
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({
    description: '用户年龄',
    example: 18,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({
    description: '用户性别',
    example: 1,
    enum: [1, 2],
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sex?: number;

  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: '用户角色',
    example: Role.Admin,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
