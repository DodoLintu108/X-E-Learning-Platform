import { UsersService } from './users.service';
import { CoursesService } from '../courses/courses.service';
import { User } from './users.entity';
export declare class UsersController {
    private readonly usersService;
    private readonly coursesService;
    constructor(usersService: UsersService, coursesService: CoursesService);
    getAllUsers(): Promise<(import("mongoose").Document<unknown, {}, import("./users.entity").UserDocument> & import("./users.entity").User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllTeachers(): Promise<(import("mongoose").Document<unknown, {}, import("./users.entity").UserDocument> & import("./users.entity").User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllStudents(): Promise<(import("mongoose").Document<unknown, {}, import("./users.entity").UserDocument> & import("./users.entity").User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    deleteUser(userId: string): Promise<{
        message: string;
    }>;
    getDashboard(req: any): Promise<any>;
    createCourse(req: any, courseData: any): Promise<import("../courses/courses.entity").Course>;
    findById(userId: string): Promise<User | null>;
    editUser(userId: string, updateData: Partial<User>): Promise<User | null>;
}
