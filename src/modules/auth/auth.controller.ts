import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/user-login-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from 'src/common/decorators/skipAuth.decorator';

@Controller('auth')
@ApiTags('认证模块')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @SkipAuth(true) // 跳过认证
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '登录',
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
