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
  Delete,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../multer.config';
import { CoursesService } from './courses.service';
import { Course } from './courses.entity';
import { Module } from './modules.entity';
import { Version } from './version.entity';
import { CreateCourseDto } from './create-course.dto';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('courses')
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'files', maxCount: 2 },
        { name: 'imagefiles', maxCount: 2 },
      ],
      multerOptions,
    ),
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
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[]; // Files for course materials
      imagefiles?: Express.Multer.File[]; // Files for course images
    },
  ) {
    console.log('create');
    const courseMaterial = files.files?.[0]?.filename || null;
    const courseImage = files.imagefiles?.[0]?.filename || null;
    const courseData = {
      ...createCourseDto,
      courseMaterial,
      courseImage,
    };
    console.log(courseData);
    const newCourse = await this.coursesService.createCourse(courseData);
    return {
      message: 'Course created successfully',
      course: newCourse,
      files: {
        material: courseMaterial,
        image: courseImage,
      },
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

  @Get('all')
  async getAllCourses(): Promise<Course[]> {
    return this.coursesService.getAllCourses();
  }

  @Get(':courseId')
  async getCourseById(@Param('courseId') courseId: string): Promise<Course> {
    return this.coursesService.getCourseById(courseId);
  }

  @Get('category')
  async getCourseByCategory(
    @Param('category') category: string,
  ): Promise<Course[]> {
    return this.coursesService.getCourseByCategory(category);
  }

  @Put(':courseId')
  async updateCourse(
    @Param('courseId') courseId: string,
    @Body() body: Partial<Course>,
  ): Promise<Course> {
    return this.coursesService.updateCourse(courseId, body);
  }

  @Get(':courseId/versions')
  async getCourseVersions(
    @Param('courseId') courseId: string,
  ): Promise<Version[]> {
    return this.coursesService.getCourseVersions(courseId);
  }

  @Delete(':courseId')
  async deleteCourse(@Param('courseId') courseId: string) {
    const result = await this.coursesService.deleteCourse(courseId);
    if (result) {
      return {
        message: 'Course deleted successfully',
      };
    }
    return {
      message: 'Course not found',
    };
  }
}
