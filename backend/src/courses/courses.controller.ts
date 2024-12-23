// APIs for course creation and management
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
  Req,
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
        category: { type: 'string' },
        difficultyLevel: { type: 'string' },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        imagefiles: {
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
    const courseMaterial = files.files?.[0]?.filename || null;
    const courseImage = files.imagefiles?.[0]?.filename || null;
    const courseData = {
      ...createCourseDto,
      courseMaterial,
      courseImage,
    };
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
  @Put(':courseId')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'files', maxCount: 2 },
        { name: 'imagefiles', maxCount: 2 },
      ],
      multerOptions,
    ),
  )
  async updateCourse(
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: Partial<Course>,
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
      imagefiles?: Express.Multer.File[];
    },
  ): Promise<any> {
    console.log('update');
    const courseMaterial = files?.files?.[0]?.filename || null;
    const courseImage = files?.imagefiles?.[0]?.filename || null;

    const courseData = {
      ...updateCourseDto,
      courseMaterial,
      courseImage,
    };
    console.log(courseData);
    const updatedCourse = await this.coursesService.updateCourse(
      courseId,
      courseData,
    );
    return {
      message: 'Course updated successfully',
      course: updatedCourse,
      files: {
        material: courseMaterial,
        image: courseImage,
      },
    };
  }

  // Get courses for students
  @Get('student')
  async getStudentCourses(@Req() req): Promise<{ assigned: Course[]; available: Course[] }> {
    const userId = req.user.userId;
    const assignedCourses = await this.coursesService.getAssignedCourses(userId);
    const availableCourses = await this.coursesService.getAvailableCourses(userId);
    return { assigned: assignedCourses, available: availableCourses };
  }

  @Get('teacher')
  async getTeacherCourses(@Req() req): Promise<Course[]> {
    const userId = req.user.userId;
    return this.coursesService.getCoursesByTeacher(userId);
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

  @Get('category/:category')
  async getCourseByCategory(
    @Param('category') category: string,
  ): Promise<Course[]> {
    return this.coursesService.getCourseByCategory(category);
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

  // Role-based course retrieval
  @Get('role/:role')
  async getCoursesByRole(@Param('role') role: string): Promise<Course[]> {
    return this.coursesService.getCoursesByRole(role);
  }
}
