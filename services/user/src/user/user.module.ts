import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProfile, UserProfileSchema } from './entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserProfile.name, schema: UserProfileSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtAuthGuard],
})
export class UserModule {}
