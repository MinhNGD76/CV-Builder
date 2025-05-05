import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './entities/event.schema';
import { Block } from './interfaces/block.interface';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class CvService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  private sign(event: Partial<Event>): string {
    const secret = process.env.EVENT_SIGN_SECRET || 'sign-me';
    const data = JSON.stringify({
      eventType: event.eventType,
      cvId: event.cvId,
      userId: event.userId,
      payload: event.payload,
    });
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  async emitEvent(eventType: string, cvId: string, userId: string, payload: any) {
    const signature = this.sign({ eventType, cvId, userId, payload });
    const event = new this.eventModel({ eventType, cvId, userId, payload, signature });
    const savedEvent = await event.save();
  
    try {
      await axios.post('http://cv-query:3000/cv/sync-event', {
        eventType,
        cvId,
        userId,
        payload,
      });
      console.log(`[cv-command] ✅ Event ${eventType} pushed to cv-query`);
    } catch (err) {
      console.error(`[cv-command] ❌ Failed to push event to cv-query:`, err.message);
    }
  
    return savedEvent;
  }

  async undoLastEvent(cvId: string) {
    const lastEvent = await this.eventModel
      .findOne({ cvId })
      .sort({ createdAt: -1 });
  
    if (!lastEvent) throw new NotFoundException('No events to undo');
  
    const result = await this.eventModel.deleteOne({ _id: lastEvent._id });
  
    try {
      await axios.post('http://cv-query:3000/cv/rebuild', { cvId });
      console.log(`[cv-command] 🔁 Rebuild projection for CV ${cvId} requested`);
    } catch (err) {
      console.error(`[cv-command] ❌ Failed to rebuild projection:`, err.message);
    }
  
    return result;
  }
  
  async getEventsByCvId(cvId: string) {
    return this.eventModel.find({ cvId }).sort({ createdAt: 1 });
  }
  
  
  async rebuildCvProjection(cvId: string) {
    const events = await this.eventModel.find({ cvId }).sort({ createdAt: 1 }).exec();
  
    const projection: {
      cvId: string;
      title: string;
      templateId: string;
      userId: string;
      blocks: Block[];
    } = {
      cvId,
      title: '',
      templateId: '',
      userId: '',
      blocks: [],
    };
  
    for (const event of events) {
      switch (event.eventType) {
        case 'CV_CREATED':
          projection.title = event.payload.title;
          projection.templateId = event.payload.templateId;
          projection.userId = event.userId;
          break;
        case 'SECTION_ADDED':
          projection.blocks.push(event.payload);
          break;
        case 'SECTION_UPDATED':
          projection.blocks = projection.blocks.map(block =>
            block.id === event.payload.id ? { ...block, ...event.payload } : block
          );
          break;
        case 'SECTION_REMOVED':
          projection.blocks = projection.blocks.filter(block => block.id !== event.payload.id);
          break;
        case 'CV_RENAMED':
          projection.title = event.payload.title;
          break;
        case 'TEMPLATE_CHANGED':
          projection.templateId = event.payload.templateId;
          break;
      }
    }
  
    return projection;
  }
}

