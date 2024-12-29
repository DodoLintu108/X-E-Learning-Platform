import { Controller, Get, Post, Put, Req, Body, Param, Delete, NotFoundException } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { UsersService } from './users.service';
import { CoursesService } from '../courses/courses.service';
import { User } from './users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService,
    @InjectModel(User.name) private readonly userModel: Model<User>,

  ) { }

  @Get('dashboard')
  @Roles('view-dashboard')
  getDashboard(@Req() req) {
    return this.usersService.getDashboard(req.user);
  }

  @Post('create-course')
  @Roles('create-courses')
  createCourse(@Req() req, @Body() courseData) {
    return this.coursesService.createCourse({
      ...courseData,
      createdBy: req.user.userId,
    });
  }

  @Get('students')
  async getAllStudents() {
    return this.usersService.findAllByRole('student');
  }

  @Get('teachers')
  async getAllTeachers() {
    return this.usersService.findAllByRole('teacher');
  }

  @Get('user/:userId')
  async findById(@Param('userId') userId: string) {
    console.log(userId);
    const courses = await this.usersService.findById(userId);
    return courses;
  }

  @Put('user/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateData: {
      name?: string;
      email?: string;
      role?: string;
      learningPreference?: string;
      subjectsOfInterest?: string[];
    },
  ) {
    return this.usersService.updateUser(userId, updateData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
  @Put('user/:userId/reset-failed-logins')
  async resetFailedLogins(@Param('userId') userId: string) {
    await this.usersService.resetFailedLogin(userId);
    return { message: 'Failed login attempts reset successfully' };
  }

  @Get('user/:userId/failed-logins')
  async getFailedLogins(@Param('userId') userId: string) {
    const attempts = await this.usersService.getFailedLoginAttempts(userId);
    return { attempts };
  }

  @Get('user/:userId/access-logs')
  async getAccessLogs(@Param('userId') userId: string) {
    const logs = await this.usersService.getUnauthorizedLogs(userId);
    return { logs };
  }

  @Delete('teachers/:id')
  async deleteTeacher(@Param('id') id: string) {
    const deleted = await this.usersService.deleteTeacher(id);
    if (deleted) {
      return { message: 'Teacher deleted successfully' };
    } else {
      throw new NotFoundException('Teacher not found');
    }
  }
 
  @Delete('students/:id')
  async deleteStudent(@Param('id') id: string) {
    const deleted = await this.userModel.deleteOne({ _id: id });
    if (deleted.deletedCount > 0) {
        return { message: 'Student deleted successfully' };
    } else {
        throw new NotFoundException('Student not found');
    }
    
  }

  @Get('students/:id/logs')
  async getStudentLogs(@Param('id') id: string) {
    const logs = await this.usersService.getUserLogs(id);
    if (!logs) {
      throw new NotFoundException('Logs not found for student');
    }
    return logs;
  }
}