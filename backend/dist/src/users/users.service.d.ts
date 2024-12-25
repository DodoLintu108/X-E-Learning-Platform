import { Model } from 'mongoose';
import { User, UserDocument } from './users.entity';
import { CoursesService } from '../courses/courses.service';
export declare class UsersService {
    private userModel;
    private coursesService;
    constructor(userModel: Model<UserDocument>, coursesService: CoursesService);
    createUser(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(userId: string): Promise<User | null>;
    getDashboard(user: any): Promise<any>;
    private getEnrolledCourses;
    private getCreatedCourses;
    private getTotalUsers;
    findAllByRole(role: string): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
}
