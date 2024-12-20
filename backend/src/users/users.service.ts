import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.entity';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly coursesService: CoursesService, // Injecting CoursesService
  ) {}

  // Create a new user
  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Find user by ID
  async findById(userId: string): Promise<User | null> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Dashboard logic based on user role
  async getDashboard(user: any): Promise<any> {
    if (user.role === 'student') {
      const enrolledCourses = await this.getEnrolledCourses(user.userId);
      return {
        message: `Welcome to your student dashboard, ${user.name}`,
        role: user.role,
        enrolledCourses,
      };
    } else if (user.role === 'instructor') {
      const createdCourses = await this.getCreatedCourses(user.userId);
      return {
        message: `Welcome to your instructor dashboard, ${user.name}`,
        role: user.role,
        createdCourses,
      };
    } else if (user.role === 'admin') {
      const totalUsers = await this.getTotalUsers();
      const allCourses = await this.coursesService.getAllCourses();
      return {
        message: `Welcome to your admin dashboard, ${user.name}`,
        role: user.role,
        totalUsers,
        allCourses,
      };
    } else {
      throw new NotFoundException('Invalid role');
    }
  }

  // Fetch enrolled courses for students
  private async getEnrolledCourses(userId: string): Promise<any[]> {
    // Call CoursesService to retrieve all courses
    const courses = await this.coursesService.getAllCourses();

    // Assuming "enrolledStudents" is an array in the course schema
    return courses.filter((course) => course.enrolledStudents?.includes(userId));
  }

  // Fetch created courses for instructors
  private async getCreatedCourses(userId: string): Promise<any[]> {
    // Call CoursesService to retrieve all courses
    const courses = await this.coursesService.getAllCourses();

    // Filter courses where the instructor (createdBy) matches userId
    return courses.filter((course) => course.createdBy === userId);
  }

  // Fetch total user count
  private async getTotalUsers(): Promise<number> {
    return this.userModel.countDocuments();
  }
}
