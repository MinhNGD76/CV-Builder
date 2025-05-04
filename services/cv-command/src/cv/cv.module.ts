import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { Event, EventSchema } from './entities/event.schema';
import { JwtStrategy } from './jwt.strategy'; // thêm dòng này

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
  controllers: [CvController],
  providers: [CvService, JwtStrategy], // thêm JwtStrategy vào providers
})
export class CvModule {}
