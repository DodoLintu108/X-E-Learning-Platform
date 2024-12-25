import { Model } from 'mongoose';
import { User } from '../../users/users.entity';
import { Course } from '../../courses/courses.entity';
export declare class BackupService {
    private userModel;
    private courseModel;
    constructor(userModel: Model<User>, courseModel: Model<Course>);
    backupDatabase(): Promise<string>;
}
