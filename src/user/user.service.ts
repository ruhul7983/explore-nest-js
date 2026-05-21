// src/user/user.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client'; // 👈 Explicit type boundaries

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Used for general lookups: completely excludes the secret password hash
  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // 2. Used EXCLUSIVELY by AuthService: keeps the password hash intact for bcrypt verification
  async findUserForAuth(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  // 3. Registers fresh users safely after verifying unique email constraints
  async createUser(data: any): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email Already Exists');
    }

    return await this.prisma.user.create({
      data,
    });
  }
}
