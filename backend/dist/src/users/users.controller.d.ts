import { UsersService } from './users.service';
import { CoursesService } from '../courses/courses.service';
import { User } from './users.entity';
import { Model } from 'mongoose';
export declare class UsersController {
    private readonly usersService;
    private readonly coursesService;
    private readonly userModel;
    constructor(usersService: UsersService, coursesService: CoursesService, userModel: Model<User>);
    getDashboard(req: any): Promise<any>;
    createCourse(req: any, courseData: any): Promise<import("../courses/courses.entity").Course>;
    getAllStudents(): Promise<User[]>;
    getAllTeachers(): Promise<User[]>;
    findById(userId: string): Promise<User>;
    updateUser(userId: string, updateData: {
        name?: string;
        email?: string;
        role?: string;
        learningPreference?: string;
        subjectsOfInterest?: string[];
    }): Promise<User>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    resetFailedLogins(userId: string): Promise<{
        message: string;
    }>;
    getFailedLogins(userId: string): Promise<{
        attempts: number;
    }>;
    getAccessLogs(userId: string): Promise<{
        logs: any[];
    }>;
    deleteTeacher(id: string): Promise<{
        message: string;
    }>;
    deleteStudent(id: string): Promise<{
        message: string;
    }>;
    getStudentLogs(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./users.entity").Log> & import("./users.entity").Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
