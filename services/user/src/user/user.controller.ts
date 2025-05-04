import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Tạo profile cá nhân (dựa vào JWT)
  @UseGuards(JwtAuthGuard)
  @Post('me')
  createProfile(@Req() req, @Body() dto: CreateUserDto) {
    const userId = req.user.userId || req.user.sub;
    return this.userService.create({ ...dto, userId });
  }

  // Lấy profile cá nhân
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    const userId = req.user.userId || req.user.sub;
    return this.userService.findOne(userId);
  }

  // Cập nhật profile
  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateProfile(@Req() req, @Body() dto: UpdateUserDto) {
    const userId = req.user.userId || req.user.sub;
    return this.userService.update(userId, dto);
  }
}
