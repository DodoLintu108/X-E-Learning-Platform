import { BackupService } from './backup.service';
import { Response } from 'express';
export declare class BackupController {
    private readonly backupService;
    constructor(backupService: BackupService);
    downloadBackup(type: string, res: Response): Promise<void>;
    createBackup(): Promise<{
        message: string;
        path: string;
    }>;
}
