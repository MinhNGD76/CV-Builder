import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfile, UserProfileDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserProfile.name) private userModel: Model<UserProfileDocument>,
  ) {}

  create(dto: CreateUserDto) {
    const user = new this.userModel(dto);
    return user.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.findOne({ userId: id }).exec();
  }

  async update(id: string, dto: UpdateUserDto) {
    const updated = await this.userModel.findOneAndUpdate(
      { userId: id },
      { $set: dto },
      { new: true },
    );
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.userModel.findOneAndDelete({ userId: id });
    if (!deleted) throw new NotFoundException('User not found');
    return deleted;
  }
}
