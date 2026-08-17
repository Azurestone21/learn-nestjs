import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  @MaxLength(12, { message: '用户名长度不能大于12位' })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @MaxLength(20, { message: '密码长度不能大于20位' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}