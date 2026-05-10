import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 👈
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module'; // 👈
import { TesterModule } from './tester/tester.module';
import { R2Module } from './r2/r2.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    R2Module, // 👈 এটা আছে
    ProjectModule,
    TesterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
