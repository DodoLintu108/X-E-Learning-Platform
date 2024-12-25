// src/analytics/analytics.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('average-quiz')
  async getAverageQuizScore(@Query('courseId') courseId: string) {
    return {
      courseId,
      averageQuizScore: await this.analyticsService.getAverageQuizScore(courseId),
    };
  }

  @Get('course')
  async getCourseAverageScore(@Query('courseId') courseId: string) {
    return await this.analyticsService.getCourseAverageScore(courseId);
  }

}

