import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsString } from 'class-validator';
import { LoginDto } from './user-login-dto';

export class RegisterDto extends LoginDto {
  @ApiProperty({
    description: '确认密码',
    example: '123456',
  })
  @MaxLength(20, { message: '确认密码长度不能大于20位' })
  @MinLength(6, { message: '确认密码长度不能小于6位' })
  @IsString({ message: '确认密码必须是字符串' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  confirmPassword: string;
}
