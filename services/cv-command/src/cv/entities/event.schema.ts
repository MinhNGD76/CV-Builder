import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  eventType: string;

  @Prop({ required: true })
  cvId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: Object })
  payload: any;

  @Prop({ required: true })
  signature: string;
}

export type EventDocument = Event & Document;
export const EventSchema = SchemaFactory.createForClass(Event);
