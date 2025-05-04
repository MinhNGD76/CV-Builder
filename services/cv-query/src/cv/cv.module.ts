// src/cv/cv.module.ts
import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cv, CvSchema } from './entities/cv.entity';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cv.name, schema: CvSchema }])],
  controllers: [CvController],
  providers: [CvService, JwtStrategy],
})
export class CvModule {}
