import { BackupService } from './backup.service';
export declare class BackupController {
    private readonly backupService;
    constructor(backupService: BackupService);
    createBackup(): Promise<{
        message: string;
        path: string;
    }>;
}
