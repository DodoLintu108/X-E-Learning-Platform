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
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
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
import mongoose from 'mongoose';

@Controller('courses')
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

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
    @Req() req, // To access the logged-in user's data
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
      imagefiles?: Express.Multer.File[];
    },
  ) {
    const courseMaterial = files?.files?.[0]?.filename || null;
    const courseImage = files?.imagefiles?.[0]?.filename || null;

    const teacherId = req.user.userId; // Extract teacher ID from the logged-in user's data

    const courseData = {
      ...createCourseDto,
      courseMaterial,
      courseImage,
      createdBy: teacherId, // Associate the course with the teacher
    };

    const newCourse = await this.coursesService.createCourse(courseData);

    return {
      message: 'Course created successfully',
      course: newCourse,    
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
    const userId = req.user.userId; // Ensure req.user.userId exists
    const courses = await this.coursesService.getCoursesByTeacher(userId);
    return courses;
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
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }


  @Get(':courseId')
  async getCourseById(@Param('courseId') courseId: string): Promise<Course> {
    return this.coursesService.getCourseById(courseId);
  }

  @Get(':roleOrId')
  async getCourses(@Param('roleOrId') roleOrId: string): Promise<Course | Course[]> {
    if (roleOrId === 'admin') {
      // Handle the "admin" case explicitly
      return this.coursesService.getAllCourses();
    } else if (mongoose.Types.ObjectId.isValid(roleOrId)) {
      // Handle fetching a course by its ObjectId
      return this.coursesService.getCourseById(roleOrId);
    } else {
      throw new BadRequestException('Invalid parameter.');
    }
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

  //handles images and files
  @Put(':courseId/files')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'files', maxCount: 2 },
        { name: 'imagefiles', maxCount: 2 },
      ],
      multerOptions,
    ),
  )
  async addFiles(
    @Param('courseId') courseId: string,
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
      imagefiles?: Express.Multer.File[];
    },
  ) {
    const courseMaterial = files?.files?.[0]?.filename || null;
    const courseImage = files?.imagefiles?.[0]?.filename || null;

    const updatedCourse = await this.coursesService.updateCourse(courseId, {
      courseMaterial,
      courseImage,
    });

    return {
      message: 'Files added successfully',
      course: updatedCourse,
    };


  }

  @Post(':courseId/quizzes')
  @Post(':courseId/quizzes')
  async addQuiz(
    @Param('courseId') courseId: string,
    @Body()
    quizData: {
      title: string;
      level: string;
      questions: Array<{ question: string; options: string[]; correctAnswer: number }>;
    },
  ): Promise<any> {
    if (!quizData.title) {
      quizData.title = 'Untitled Quiz'; // Set a default title
    }
    const quiz = await this.coursesService.addQuizToCourse(courseId, quizData);
    return {
      message: 'Quiz added successfully',
      quiz,
    };
  }
  
  @Put(':id/end')
  async endCourse(@Param('id') id: string) {
    try {
      const course = await this.coursesService.endCourse(id); // Define this method in the service
      return { message: 'Course has been ended successfully', course };
    } catch (error) {
      throw new HttpException('Failed to end the course', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Post(':courseId/quizzes/:quizId/submit')
  async submitQuiz(
    @Param('courseId') courseId: string,
    @Param('quizId') quizId: string,
    @Body()
    body: { userId: string; answers: Array<{ questionId: string; answer: number }> }
  ): Promise<{ score: number }> {
    const { userId, answers } = body;
    return this.coursesService.submitQuizResponse(courseId, quizId, userId, answers);
  }
  


  @Get(':courseId/quizzes')
  async getQuizzes(@Param('courseId') courseId: string) {
    return this.coursesService.getQuizzesByCourse(courseId);
  }

  @Get(':courseId/quizzes/:quizId')
  async getQuiz(
    @Param('courseId') courseId: string,
    @Param('quizId') quizId: string
  ) {
    return this.coursesService.getQuizById(courseId, quizId);
  }


  @Delete(':courseId/quizzes/:quizId')
  async deleteQuiz(
    @Param('courseId') courseId: string,
    @Param('quizId') quizId: string
  ) {
    const course = await this.coursesService.deleteQuiz(courseId, quizId);
    return {
      message: 'Quiz deleted successfully',
      course,
    };
  }


  @Post(':courseId/lectures')
  async addLecture(
    @Param('courseId') courseId: string,
    @Body() lectureData: { title: string; type: 'video' | 'pdf'; content: string },
  ) {
    const updatedCourse = await this.coursesService.addLecture(courseId, lectureData);
    return {
      message: 'Lecture added successfully',
      course: updatedCourse,
    };
  }

  @Post(':courseId/enroll')
  async enrollInCourse(
    @Param('courseId') courseId: string,
    @Req() req: any // To access the logged-in user's data
  ) {
    const userId = req.user.userId; // Assuming `userId` is available in the request object
    const updatedCourse = await this.coursesService.enrollStudent(courseId, userId);
    return {
      message: 'Enrolled successfully',
      course: updatedCourse,
    };
  }
  @Get(':courseId/details')
  async getCourseDetails(@Param('courseId') courseId: string): Promise<any> {
    const course = await this.coursesService.getCourseDetails(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }
  @Get(':courseId/quizzes')
  async getQuizzesForCourse(@Param('courseId') courseId: string) {
    return this.coursesService.getAllQuizzesForCourse(courseId);
  }

}
