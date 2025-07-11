import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CvModule } from './cv/cv.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || ''), // ✅ kết nối Mongo
    CvModule,
  ],
})
export class AppModule {}
