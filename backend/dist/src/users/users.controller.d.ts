import { UsersService } from './users.service';
import { CoursesService } from '../courses/courses.service';
import { User } from './users.entity';
export declare class UsersController {
    private readonly usersService;
    private readonly coursesService;
    constructor(usersService: UsersService, coursesService: CoursesService);
    getDashboard(req: any): Promise<any>;
    createCourse(req: any, courseData: any): Promise<import("../courses/courses.entity").Course>;
    findById(userId: string): Promise<User | null>;
    editUser(userId: string, updateData: Partial<User>): Promise<User | null>;
}
