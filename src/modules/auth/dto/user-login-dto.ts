import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

import { IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @IsString()
  password: string;
}