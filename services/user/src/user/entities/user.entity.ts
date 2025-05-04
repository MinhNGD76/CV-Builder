import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserProfile {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  avatarUrl: string;

  @Prop()
  bio: string;
}

export type UserProfileDocument = UserProfile & Document;
export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
