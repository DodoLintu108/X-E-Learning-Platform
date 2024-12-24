import { Controller, Post, HttpCode, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { BackupService } from './backup.service';
import { AuthGuard } from '../auth/auth.guard';


@Controller('backup')
export class BackupController {
    constructor(private readonly backupService: BackupService) { }

    @Post('backup')
    @HttpCode(HttpStatus.OK)
    async createBackup() {
        try {
            const backupPath = await this.backupService.backupDatabase();
            return { message: 'Backup created successfully', path: backupPath };
        } catch (error) {
            throw new HttpException('Failed to create backup', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
