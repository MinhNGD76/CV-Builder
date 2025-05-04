// src/cv/entities/cv.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Cv {
  @Prop({ required: true })
  cvId: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  title: string;

  @Prop()
  templateId: string;

  @Prop({ type: Array })
  blocks: any[];
}

export type CvDocument = Cv & Document;
export const CvSchema = SchemaFactory.createForClass(Cv);
