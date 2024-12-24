import { Roles } from './roles.decorator'; // Ensure you created this custom decorator
import { UsersService } from './users.service';
import { CoursesService } from '../courses/courses.service'; // Import CoursesService
import { User, UserDocument } from './users.entity';
import { Controller, Get, Post, Delete, Param, Req, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // Ensure you use an AuthGuard to protect routes

@Controller('users')
@UseGuards(AuthGuard) // Protect all endpoints in this controller
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService, // Inject CoursesService
  ) {}

  // Get all users
  @Get('all')
  @Roles('admin') // Only allow admins
  async getAllUsers() {
    return this.usersService.getAllUsers(); // Retrieve all users
  }

  // Get all teachers
  @Get('teachers')
  @Roles('admin') // Only allow admins
  async getAllTeachers() {
    return this.usersService.getAllTeachers(); // Retrieve all teachers
  }

  // Get all students
  @Get('students')
  @Roles('admin') // Only allow admins
  async getAllStudents() {
    return this.usersService.getAllStudents(); // Retrieve all students
  }

  // Delete a user by ID
  @Delete(':id')
  @Roles('admin') // Only allow admins
  async deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId); // Delete user by ID
  }

  // Dashboard route for user-specific data
  @Get('dashboard')
  @Roles('view-dashboard') // Role-based access control
  getDashboard(@Req() req) {
    return this.usersService.getDashboard(req.user); // Ensure req.user is attached by middleware
  }

  // Create a course (only for teachers)
  @Post('create-course')
  @Roles('teacher') // Only teachers can create courses
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
