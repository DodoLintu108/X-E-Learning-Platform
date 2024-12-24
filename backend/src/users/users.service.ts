import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.entity';
import { CoursesService } from '../courses/courses.service';
import { Log } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Log.name) private readonly logModel: Model<Log>,
    private readonly coursesService: CoursesService,
  ) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(
    userId: string,
    updateData: {
      name?: string;
      email?: string;
      role?: string;
      learningPreference?: string;
      subjectsOfInterest?: string[];
    },
  ): Promise<User> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update only the provided fields
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;
    if (updateData.role) user.role = updateData.role;
    if (updateData.learningPreference) {
      user.learningPreference = updateData.learningPreference;
    }
    if (updateData.subjectsOfInterest) {
      user.subjectsOfInterest = updateData.subjectsOfInterest;
    }

    return user.save();
  }

  async getDashboard(user: any): Promise<any> {
    if (user.role === 'student') {
      const enrolledCourses = await this.getEnrolledCourses(user.userId);
      const userPreferences = await this.findById(user.userId);
      return {
        message: `Welcome to your student dashboard, ${user.name}`,
        role: user.role,
        enrolledCourses,
        learningPreference: userPreferences.learningPreference,
        subjectsOfInterest: userPreferences.subjectsOfInterest,
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

  private async getEnrolledCourses(userId: string): Promise<any[]> {
    const courses = await this.coursesService.getAllCourses();
    return courses.filter((course) => course.enrolledStudents?.includes(userId));
  }

  private async getCreatedCourses(userId: string): Promise<any[]> {
    const courses = await this.coursesService.getAllCourses();
    return courses.filter((course) => course.createdBy === userId);
  }

  private async getTotalUsers(): Promise<number> {
    return this.userModel.countDocuments();
  }



  async deleteTeacher(userId: string): Promise<boolean> {
    const user = await this.userModel.findOne({ _id: userId, role: 'teacher' });
    if (!user) {
      throw new NotFoundException('Teacher not found');
    }
    await this.userModel.deleteOne({ _id: userId });
    return true;
  }
  

  async deleteStudent(userId: string): Promise<void> {
    const user = await this.userModel.findOne({ _id: userId, role: 'student' }).exec();
    if (!user) {
      throw new NotFoundException('Student not found');
    }
    await this.userModel.deleteOne({ _id: userId });
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(userId);
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async findAllByRole(role: string): Promise<User[]> {
    return this.userModel.find({ role })
      .select('-passwordHash')
      .exec();
  }

  async logFailedLogin(userId: string, ipAddress: string): Promise<void> {
    const user = await this.userModel.findOne({ userId });
    if (user) {
      user.failedLoginAttempts += 1;
      user.unauthorizedAccessLogs.push({
        date: new Date(),
        ipAddress,
      });
      await user.save();
    }
  }

  async resetFailedLogin(userId: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { userId },
      { failedLoginAttempts: 0 }
    );
  }

  async getFailedLoginAttempts(userId: string): Promise<number> {
    const user = await this.userModel.findOne({ userId });
    return user ? user.failedLoginAttempts : 0;
  }

  async getUnauthorizedLogs(userId: string): Promise<any[]> {
    const user = await this.userModel.findOne({ userId });
    return user ? user.unauthorizedAccessLogs : [];
  }


  // Reset failed logins
  async resetFailedLogins(userId: string, role: string): Promise<boolean> {
    const user = await this.userModel.findOne({ _id: userId, role });
    if (!user) return false;

    user.failedLoginAttempts = 0;
    await user.save();
    return true;
  }

  // Fetch user logs
  async getUserLogs(userId: string) {
    return this.logModel.find({ userId }).exec();
  }

}

