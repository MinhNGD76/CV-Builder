import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
import { CvService } from './cv.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { v4 as uuidv4 } from 'uuid';
import { Block } from './interfaces/block.interface';

interface CvProjection {
  cvId: string;
  title: string;
  templateId: string;
  userId: string;
  blocks: Block[];
}

@Controller('cv')
@UseGuards(JwtAuthGuard)
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('create')
  async createCv(@Body() body: any, @Req() req) {
    const userId = req.user.userId;
    const cvId = body.cvId || uuidv4(); // có thể cho phép client tự gửi hoặc server tự sinh
    const { title, templateId } = body;
    return this.cvService.emitEvent('CV_CREATED', cvId, userId, { title, templateId });
  }

  @Post('add-section')
  async addSection(@Body() body: any, @Req() req) {
    const userId = req.user.userId;
    const { cvId, section } = body;
    return this.cvService.emitEvent('SECTION_ADDED', cvId, userId, section);
  }

  @Post('update-section')
  async updateSection(@Body() body: any, @Req() req) {
    const userId = req.user.userId;
    const { cvId, section } = body;
    return this.cvService.emitEvent('SECTION_UPDATED', cvId, userId, section);
  }

  @Post('remove-section')
  async removeSection(@Body() body: any, @Req() req) {
    const userId = req.user.userId;
    const { cvId, sectionId } = body;
    return this.cvService.emitEvent('SECTION_REMOVED', cvId, userId, { id: sectionId });
  }

  @Post('rename')
  async renameCv(@Body() body: any, @Req() req) {
    const userId = req.user.userId;
    const { cvId, newTitle } = body;
    return this.cvService.emitEvent('CV_RENAMED', cvId, userId, { title: newTitle });
  }

  @Post('change-template')
  async changeTemplate(@Body() body: any, @Req() req) {
    const userId = req.user.userId;
    const { cvId, templateId } = body;
    return this.cvService.emitEvent('TEMPLATE_CHANGED', cvId, userId, { templateId });
  }

  @Post('undo')
  async undo(@Body() body: any) {
    const { cvId } = body;
    return this.cvService.undoLastEvent(cvId);
  }

  @Get(':cvId/preview')
  async previewCv(@Param('cvId') cvId: string): Promise<CvProjection> {
    return this.cvService.rebuildCvProjection(cvId);
  }
}
