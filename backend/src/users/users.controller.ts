import { Controller, Get, Post, Req, Body, Param, Put } from '@nestjs/common'; // Import NestJS decorators
import { Roles } from './roles.decorator'; // Ensure you created this custom decorator
import { UsersService } from './users.service';
import { CoursesService } from '../courses/courses.service'; // Import CoursesService
import { User, UserDocument } from './users.entity';

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
    return this.coursesService.createCourse({
      ...courseData,
      createdBy: req.user.userId,
    }); // Pass course creation to CoursesService
  }
  @Get('user/:userId')
  async findById(@Param('userId') userId: string): Promise<User | null> {
    console.log(userId);
    const courses = await this.usersService.findById(userId);
    return courses;
  }

  @Put('user/:userId')
  async editUser(
    @Param('userId') userId: string, // Get userId from the URL parameter
    @Body() updateData: Partial<User>, // Get the update data from the request body
  ): Promise<User | null> {
    console.log('User ID:', userId);
    console.log('Update Data:', updateData);

    const updatedUser = await this.usersService.editUser(userId, updateData);

    return updatedUser;
  }
}
