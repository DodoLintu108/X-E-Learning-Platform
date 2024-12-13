// APIs for course creation and management (Tasks 2.1, 2.2)
import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Query,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../multer.config';
import { CoursesService } from './courses.service';
import { Course } from './courses.entity';
import { Module } from './modules.entity';
import { Version } from './version.entity';

import { CreateCourseDto } from './create-course.dto';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  @Post('create')
  @UseInterceptors(
    FilesInterceptor('files', 2, multerOptions), // Allow up to 2 files
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new course with materials and image',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('create');
    const [courseMaterial, courseImage] = files;
    const courseData = {
      ...createCourseDto,
      courseMaterial: courseMaterial?.filename || null,
      courseImage: courseImage?.filename || null, 
    };
    console.log(courseData);
    const newCourse = await this.coursesService.createCourse(courseData);
    return {
      message: 'Course created successfully',
      course: newCourse,
      files: files.map((file) => ({
        originalName: file.originalname,
        savedName: file.filename,
      })),
    };
  }

  @Post(':courseId/modules')
  async addModule(
    @Param('courseId') courseId: string,
    @Body()
    body: {
      title: string;
      content: string;
      resources?: string[];
    },
  ): Promise<Module> {
    const moduleData = { courseId, ...body }; // Combine courseId with the body data
    return this.coursesService.addModule(moduleData);
  }

  @Get('search')
  async searchCourses(@Query('query') query: string): Promise<Course[]> {
    return this.coursesService.searchCourses(query);
  }

  @Put(':courseId')
  async updateCourse(
    @Param('courseId') courseId: string,
    @Body() body: Partial<Course>,
    @Body('updatedBy') updatedBy: string,
  ): Promise<Course> {
    return this.coursesService.updateCourse(courseId, body, updatedBy);
  }

  @Get(':courseId/versions')
  async getCourseVersions(
    @Param('courseId') courseId: string,
  ): Promise<Version[]> {
    return this.coursesService.getCourseVersions(courseId);
  }
}
