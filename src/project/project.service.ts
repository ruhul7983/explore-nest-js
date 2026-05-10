// src/project/project.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { R2Service } from 'src/r2/r2.service';
import { CreateProjectDto } from './create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2Service: R2Service,
  ) {}

  async createProject(dto: CreateProjectDto, file: Express.Multer.File) {
    // ১. image upload করো R2 তে
    const imageUrl = await this.r2Service.uploadFile(file);

    // ২. DB তে save করো
    return await this.prisma.project.create({
      data: {
        title: dto.title,
        details: dto.details,
        techStack: dto.techStack,
        imageUrl,
      },
    });
  }

  async getAllProjects() {
    return await this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
