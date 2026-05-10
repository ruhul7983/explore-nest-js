// src/user/user.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from 'src/auth/registerUser.dto';
/**
 * FIX: Import from the index folder directly.
 * This allows TS to find the generated index.d.ts file.
 */

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * We add 'async' and 'await' here.
   * This ensures ESLint can verify that the returned value
   * matches the Promise<User> type definition.
   */
  async createUser(data: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('Email Already Exist');
    }
    return this.prisma.user.create({
      data, // name, email, password — matches Prisma schema exactly
    });
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`); // 👈
    }
    return user;
  }
}
