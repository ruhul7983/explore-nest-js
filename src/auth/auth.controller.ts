import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './registerUser.dto';

@Controller('auth')
export class AuthController {
  authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }
  @Post('register')
  register(@Body() registerUserDto: RegisterDto) {
    const result = this.authService.registerUser(registerUserDto);
    return result;
  }
  @Get('login')
  login() {
    return { message: 'User logged in' };
  }
  @Get('find')
  findByEmail(@Query('email') email: string) {
    return this.authService.findUserByEmail(email);
  }
}
