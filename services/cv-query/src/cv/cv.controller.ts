import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { JwtAuthGuard } from '../cv/jwt-auth.guard';
import { RequestWithUser } from '../cv/interfaces/request-with-user.interface';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.cvService.findAll(userId);
  }

  @Get(':cvId')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('cvId') cvId: string) {
    return this.cvService.findOne(cvId);
  }

  @Post('sync-event')
  async syncEvent(@Body() event: any) {
    return this.cvService.applyEvent(event);
  }

  @Post('rebuild')
  async rebuildProjection(@Body() body: any) {
    const { cvId } = body;
    return this.cvService.rebuildFromEvents(cvId);
  }

  @Post('rebuild/:cvId')
  async rebuildVersion(@Param('cvId') cvId: string) {
    return this.cvService.rebuildFromEvents(cvId);
  }

  @Get(':cvId/version/:version')
  async getVersionedProjection(
    @Param('cvId') cvId: string,
    @Param('version') version: string,
  ) {
    const versionIndex = parseInt(version, 10);
    return this.cvService.rebuildToVersion(cvId, versionIndex);
  }
}
