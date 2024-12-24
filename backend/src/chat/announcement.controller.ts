import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';

@Controller('announcement')
export class AnnouncementController {
  constructor(private announcementService: AnnouncementService) {}

  @Post()
  async createAnnouncement(
    @Body() body: { courseId: string; title: string; content: string },
  ) {
    return this.announcementService.createAnnouncement(
      body.courseId,
      body.title,
      body.content,
    );
  }

  @Get(':courseId')
  async getCourseAnnouncements(@Param('courseId') courseId: string) {
    return this.announcementService.getCourseAnnouncements(courseId);
  }
}
