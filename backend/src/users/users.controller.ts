import { Controller, Get, Post, Req, Body , Delete , Param } from '@nestjs/common'; // Import NestJS decorators
import { Roles } from './roles.decorator'; // Ensure you created this custom decorator
import { UsersService } from './users.service';
import { CoursesService } from '../courses/courses.service'; // Import CoursesService

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService, // Inject CoursesService
  ) {}

  @Get('dashboard')
  @Roles('view-dashboard') // Role-based access control
  getDashboard(@Req() req) {
    return this.usersService.getDashboard(req.user); // Ensure req.user is attached by middleware
  }

  @Post('create-course')
  @Roles('create-courses') // Role-based access control
  createCourse(@Req() req, @Body() courseData) {
    return this.coursesService.createCourse({ ...courseData, createdBy: req.user.userId }); // Pass course creation to CoursesService
  }
  @Get('teachers')
  @Roles('admin')
  getAllTeachers() {
    return this.usersService.findAllTeachers();
  }

  @Delete(':id')
  @Roles('admin')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete('teachers/:id')
  @Roles('admin')
  deleteTeacher(@Param('id') id: string) {
    return this.usersService.removeTeacher(id);
  }  
}
