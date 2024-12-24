import { Model } from 'mongoose';
import { User, UserDocument } from './users.entity';
import { CoursesService } from '../courses/courses.service';
import { Log } from './users.entity';
export declare class UsersService {
    private userModel;
    private readonly logModel;
    private readonly coursesService;
    constructor(userModel: Model<UserDocument>, logModel: Model<Log>, coursesService: CoursesService);
    createUser(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(userId: string): Promise<User | null>;
    updateUser(userId: string, updateData: {
        name?: string;
        email?: string;
        role?: string;
        learningPreference?: string;
        subjectsOfInterest?: string[];
    }): Promise<User>;
    getDashboard(user: any): Promise<any>;
    private getEnrolledCourses;
    private getCreatedCourses;
    private getTotalUsers;
    deleteTeacher(userId: string): Promise<boolean>;
    deleteStudent(userId: string): Promise<void>;
    deleteUser(userId: string): Promise<void>;
    findAllByRole(role: string): Promise<User[]>;
    logFailedLogin(userId: string, ipAddress: string): Promise<void>;
    resetFailedLogin(userId: string): Promise<void>;
    getFailedLoginAttempts(userId: string): Promise<number>;
    getUnauthorizedLogs(userId: string): Promise<any[]>;
    resetFailedLogins(userId: string, role: string): Promise<boolean>;
    getUserLogs(userId: string): Promise<(import("mongoose").Document<unknown, {}, Log> & Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
