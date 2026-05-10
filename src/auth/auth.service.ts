import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  private generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
  async registerUser(registerUserDto: RegisterDto) {
    // ১. password hash করো
    const hash = await bcrypt.hash(registerUserDto.password, 10);

    // ২. user create করো
    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // ৪. token sign করো
    const token = this.generateToken(payload);

    // ৫. return করো
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: token,
    };
  }
  async findUserByEmail(email: string) {
    return this.userService.findUserByEmail(email);
  }
}
