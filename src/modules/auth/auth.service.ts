import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/user-login-dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-dto';
import * as bcrypt from 'bcrypt';

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
    if (!await bcrypt.compare(password, user.password)) {
      throw new NotFoundException('密码错误');
    }
    // 生成 JWT
    const payload = { userId: user.id, username, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    // 返回 JWT
    return { accessToken };
  }

  async register(registerDto: RegisterDto) {
    const { username, password, confirmPassword } = registerDto;
    if (password !== confirmPassword) {
      throw new NotFoundException('两次密码不一致');
    }
    // 哈希
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.usersService.create({ username, password: hashedPassword });
    return true;
  }
}
