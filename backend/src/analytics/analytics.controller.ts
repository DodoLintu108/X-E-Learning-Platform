// APIs for analytics and tracking (Tasks 4.1, 4.2)

import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics') // Base route for all analytics-related endpoints
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Task 4.1: Get Student Dashboard Metrics
   * This endpoint fetches performance metrics for a specific student.
   * 
   * @param studentId - ID of the student for whom metrics are fetched
   */
  @Get('student')
  async getStudentMetrics(@Query('studentId') studentId: string) {
    // Delegate the request to AnalyticsService
    return this.analyticsService.getStudentMetrics(studentId);
  }

  /**
   * Task 4.2: Get Instructor Analytics
   * This endpoint fetches analytics data for instructors.
   * 
   * @param instructorId - ID of the instructor for whom analytics data is fetched
   */
  @Get('instructor')
  async getInstructorAnalytics(@Query('instructorId') instructorId: string) {
    // Delegate the request to AnalyticsService
    return this.analyticsService.getInstructorAnalytics(instructorId);
  }

  /**
   * Task 4.2: Get Downloadable Report for Instructor
   * This endpoint provides a downloadable link to an instructor's performance report.
   * 
   * @param instructorId - ID of the instructor for whom the report is generated
   */
  @Get('download-report')
  async getDownloadableReport(@Query('instructorId') instructorId: string) {
    // Delegate the request to AnalyticsService
    return this.analyticsService.getDownloadableReport(instructorId);
  }
}

