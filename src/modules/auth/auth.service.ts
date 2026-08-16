import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/user-login-dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.usersService.findOne({ username });
    if (!user) {
      throw new NotFoundException('用户名不存在');
    }
    // 密码应该使用 bcrypt 进行处理，这里为了简单起见，直接比较
    if (user.password !== password) {
      throw new NotFoundException('密码错误');
    }
    // 生成 JWT
    const payload = { userId: user.id, username, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    // 返回 JWT
    return { accessToken };
  }
}
