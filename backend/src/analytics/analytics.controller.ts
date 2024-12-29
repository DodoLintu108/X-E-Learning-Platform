// src/analytics/analytics.controller.ts
import { Controller, Get, NotFoundException, Query, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('analytics')
@UseGuards(AuthGuard) // <-- Apply the AuthGuard to the entire controller 
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
    return this.analyticsService.getCourseAverageScore(courseId);
  }
  
  @Get('quiz')
  async getQuizAnalytics(@Query('quizId') quizId: string) {
    return {
      quizId,
      averageQuizScore: await this.analyticsService.getQuizAnalytics(quizId),
    };
  }

  @Get('student')
  async getStudentAnalytics(@Req() req, @Query('courseId') courseId: string) {
    // 1) Identify the user from req (assuming JWT is used)
    const userId = req.user.userId; 
    if (!courseId) {
      throw new NotFoundException('courseId is required');
    }
    // 2) Delegate to the service
    return this.analyticsService.getStudentAnalytics(courseId, userId);
  }

}

