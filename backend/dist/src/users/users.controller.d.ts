import { UsersService } from './users.service';
import { CoursesService } from '../courses/courses.service';
export declare class UsersController {
    private readonly usersService;
    private readonly coursesService;
    constructor(usersService: UsersService, coursesService: CoursesService);
    getDashboard(req: any): any;
    createCourse(req: any, courseData: any): Promise<import("../courses/courses.entity").Course>;
    getAllTeachers(): any;
    deleteUser(id: string): any;
    deleteTeacher(id: string): any;
}
