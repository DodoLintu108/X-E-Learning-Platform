import { UsersService } from './users.service';
import { CoursesService } from '../courses/courses.service';
export declare class UsersController {
    private readonly usersService;
    private readonly coursesService;
    constructor(usersService: UsersService, coursesService: CoursesService);
    getDashboard(req: any): Promise<any>;
    createCourse(req: any, courseData: any): Promise<import("../courses/courses.entity").Course>;
    getAllStudents(): Promise<import("./users.entity").User[]>;
    getAllTeachers(): Promise<import("./users.entity").User[]>;
    findById(userId: string): Promise<import("./users.entity").User>;
    deleteTeacher(userId: string): Promise<void>;
    deleteStudent(userId: string): Promise<void>;
}
