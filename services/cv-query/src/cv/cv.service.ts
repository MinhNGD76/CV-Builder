// src/cv/cv.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cv, CvDocument } from './entities/cv.entity';
import { Model } from 'mongoose';
import axios from 'axios';

export interface Block {
  id: string;
  type?: string;
  content?: string;
  [key: string]: any;
}

interface CvEvent {
  eventType: string;
  payload: any;
  userId: string;
  cvId: string;
  createdAt: string;
}

@Injectable()
export class CvService {
  constructor(@InjectModel(Cv.name) private cvModel: Model<CvDocument>) {}

  async findAll(userId: string) {
    return this.cvModel.find({ userId }, 'cvId title templateId updatedAt').sort({ updatedAt: -1 });
  }

  async findOne(cvId: string) {
    return this.cvModel.findOne({ cvId });
  }

  async applyEvent(event: any) {
    const { eventType, cvId, userId, payload } = event;
  
    let cv = await this.cvModel.findOne({ cvId });
  
    if (!cv && eventType === 'CV_CREATED') {
      return this.cvModel.create({
        cvId,
        userId,
        title: payload.title,
        templateId: payload.templateId,
        blocks: [],
      });
    }
  
    if (!cv) return;
  
    switch (eventType) {
      case 'SECTION_ADDED':
        cv.blocks.push(payload);
        cv.markModified('blocks');
        break;
      case 'SECTION_UPDATED':
        cv.blocks = cv.blocks.map(block =>
          block.id === payload.id ? { ...block, ...payload } : block
        );
        break;
      case 'SECTION_REMOVED':
        cv.blocks = cv.blocks.filter(block => block.id !== payload.id);
        break;
      case 'CV_RENAMED':
        cv.title = payload.title;
        break;
      case 'TEMPLATE_CHANGED':
        cv.templateId = payload.templateId;
        break;
    }
  
    return cv.save();
  }
  
  async rebuildFromEvents(cvId: string) {
    const res = await axios.get<CvEvent[]>(`http://cv-command:3000/cv/event/cv/${cvId}`);
    const events = res.data;

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

    await this.cvModel.deleteOne({ cvId });
    return this.cvModel.create(projection);
  }
  
  async rebuildToVersion(cvId: string, version: number) {
    const res = await axios.get<CvEvent[]>(`http://cv-command:3000/cv/event/cv/${cvId}`);
    const allEvents = res.data;
  
    const events = allEvents.slice(0, version); // lấy n event đầu tiên
  
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
