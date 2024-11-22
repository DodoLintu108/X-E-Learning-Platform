import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: { name: string; email: string; password: string; role: string }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.usersService.createUser({
      ...userData,
      passwordHash: hashedPassword,
    });
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.userId, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}