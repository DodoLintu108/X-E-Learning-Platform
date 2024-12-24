import { Model } from 'mongoose';
export declare class BackupService {
    private readonly coursesModel;
    private readonly userModel;
    constructor(coursesModel: Model<any>, userModel: Model<any>);
    handleCron(): Promise<void>;
    backupDatabase(): Promise<string>;
}
