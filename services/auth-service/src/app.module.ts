import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose'; // THÊM VÀO
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || ''), // Thêm giá trị mặc định để tránh undefined
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
