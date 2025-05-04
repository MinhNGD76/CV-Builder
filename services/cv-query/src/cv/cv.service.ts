// src/cv/cv.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cv, CvDocument } from './entities/cv.entity';
import { Model } from 'mongoose';

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
  
  
}
