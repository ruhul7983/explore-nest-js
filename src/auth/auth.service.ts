// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload.interface';
import { Role } from '@prisma/client'; // 👈 1. Import native Prisma Enum
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // 2. Use the imported 'Role' enum here so it accepts database types natively
  private async createSession(userId: string, email: string, role: Role) {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role: role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.userToken.create({
      data: {
        accessToken,
        refreshToken,
        userId,
        expiresAt,
      },
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const hash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userService.createUser({
      ...registerDto,
      password: hash,
    });

    return this.createSession(user.id, user.email, user.role);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findUserForAuth(loginDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return this.createSession(user.id, user.email, user.role);
  }

  async refreshSession(refreshToken: string) {
    try {
      // 3. Removed 'const payload = ' assignment to fix the unused variable error.
      // It still validates the token and throws an error if it's invalid.
      this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const storedToken = await this.prisma.userToken.findUnique({
        where: { refreshToken },
        include: { user: true },
      });

      if (
        !storedToken ||
        !storedToken.isValid ||
        new Date() > storedToken.expiresAt
      ) {
        throw new UnauthorizedException('Session expired or untrusted');
      }

      await this.prisma.userToken.delete({ where: { id: storedToken.id } });

      // This now executes smoothly because the types match perfectly
      return this.createSession(
        storedToken.user.id,
        storedToken.user.email,
        storedToken.user.role,
      );
    } catch {
      throw new UnauthorizedException('Invalid session context');
    }
  }

  async logout(accessToken: string) {
    await this.prisma.userToken.deleteMany({
      where: { accessToken },
    });
    return { message: 'Logged out successfully' };
  }
}
