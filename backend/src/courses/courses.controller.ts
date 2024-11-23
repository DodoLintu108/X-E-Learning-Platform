// APIs for course creation and management (Tasks 2.1, 2.2)
import { Controller, Post, Get, Put, Body, Query, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './courses.entity';
import { Module } from './modules.entity';
import { Version } from './version.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * Create a new course
   */
  @Post('create')
  async createCourse(@Body() body: {
    title: string;
    description: string;
    category: string;
    difficultyLevel: string;
    createdBy: string;
  }): Promise<Course> {
    return this.coursesService.createCourse(body);
  }

  /**
   * Add a new module to a course
   */
  @Post(':courseId/modules')
  async addModule(
    @Param('courseId') courseId: string,
    @Body() body: {
      title: string;
      content: string;
      resources?: string[];
    },
  ): Promise<Module> {
    const moduleData = { courseId, ...body }; // Combine courseId with the body data
    return this.coursesService.addModule(moduleData);
  }

  /**
   * Search for courses by title
   */
  @Get('search')
  async searchCourses(@Query('query') query: string): Promise<Course[]> {
    return this.coursesService.searchCourses(query);
  }

  /**
   * Update a course and save its version history
   */
  @Put(':courseId')
  async updateCourse(
    @Param('courseId') courseId: string,
    @Body() body: Partial<Course>,
    @Body('updatedBy') updatedBy: string,
  ): Promise<Course> {
    return this.coursesService.updateCourse(courseId, body, updatedBy);
  }

  /**
   * Get version history for a course
   */
  @Get(':courseId/versions')
  async getCourseVersions(@Param('courseId') courseId: string): Promise<Version[]> {
    return this.coursesService.getCourseVersions(courseId);
  }
}