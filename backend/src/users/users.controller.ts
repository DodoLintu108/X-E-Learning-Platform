import { Controller, Get, Post, Req, Body, Param } from '@nestjs/common';
import { Roles } from './roles.decorator'; // Role-based decorator
import { UsersService } from './users.service';
import { CoursesService } from '../courses/courses.service'; // For course operations

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService, // Injected CoursesService
  ) {}

  @Get('dashboard')
  @Roles('view-dashboard') // Role-based Access
  getDashboard(@Req() req) {
    return this.usersService.getDashboard(req.user); // Assuming middleware attaches req.user
  }

  @Post('create-course')
  @Roles('create-courses') // Role-based access control
  createCourse(@Req() req, @Body() courseData) {
    return this.coursesService.createCourse({ ...courseData, createdBy: req.user.userId });
  }

  @Get('students')
  async getAllStudents() {
    return this.usersService.findAllByRole('student'); // Fetch all students
  }

  @Get('teachers')
  async getAllTeachers() {
    return this.usersService.findAllByRole('teacher'); // Fetch all teachers
  }

  
  @Post('delete/teachers/:userId')
  async deleteTeacher(@Param('userId') userId: string) {
    return this.usersService.deleteTeacher(userId); // Specific to teachers
  }

  @Post('delete/student/:userId')
  async deleteStudent(@Param('userId') userId: string) {
    return this.usersService.deleteStudent(userId); // Specific to students
  }
}
  

  
  
