import { Controller, Post, Body, UnauthorizedException, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateAuthDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  async login(@Body() dto: CreateAuthDto) {
    const token = await this.authService.login(dto.email, dto.password);
    if (!token) throw new UnauthorizedException('Invalid credentials');
    return token;
  }

  @Post('verify')
  async verify(@Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return { valid: false };
    }
    
    const token = auth.split(' ')[1];
    const isValid = await this.authService.verifyToken(token);
    
    return { valid: isValid };
  }
}
