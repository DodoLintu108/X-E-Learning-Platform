import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.entity';
import { CoursesService } from '../courses/courses.service'; // Import CoursesService
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private coursesService: CoursesService, // Inject CoursesService
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
    return courses.filter((course) =>
      course.enrolledStudents?.includes(userId),
    );
  }

  private async getCreatedCourses(userId: string): Promise<any[]> {
    const courses = await this.coursesService.getAllCourses();

    return courses.filter((course) => course.createdBy === userId);
  }

  private async getTotalUsers(): Promise<number> {
    return this.userModel.countDocuments();
  }

  
  async editUser(
    userId: string,
    updateData: Partial<User>,
  ): Promise<User | null> {
    // Find a single user by userId
    const user = await this.userModel.findOne({ userId: userId });

    // If no user is found, throw a NotFoundException
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the user with the provided data
    Object.assign(user, updateData);

    // Save the updated user
    await user.save();

    // Return the updated user object
    return user;
  }
  async getAllUsers() {
    return this.userModel.find().exec(); // Fetch all users
  }

  // Get all teachers
  async getAllTeachers() {
    return this.userModel.find({ role: 'teacher' }).exec(); // Fetch teachers
  }

  // Get all students
  async getAllStudents() {
    return this.userModel.find({ role: 'student' }).exec(); // Fetch students
  }

  // Delete a user by ID
  async deleteUser(userId: string) {
    const result = await this.userModel.deleteOne({ userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return { message: `User with ID ${userId} deleted successfully` };
  }
}
