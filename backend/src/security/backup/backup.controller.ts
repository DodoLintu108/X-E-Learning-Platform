import {
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    HttpException,
    Get,
    Param,
    Res,
  } from '@nestjs/common';
  
  import { BackupService } from './backup.service';
  import { Response } from 'express';
  import * as path from 'path';
  import * as fs from 'fs';
  
  @Controller('backup')
  export class BackupController {
    constructor(private readonly backupService: BackupService) {}
  
    @Get('download/:type')
    async downloadBackup(@Param('type') type: string, @Res() res: Response) {
      const date = new Date().toISOString().split('T')[0];
      const backupDirectory = path.join(__dirname, '..', 'backups');
      const filePath = path.join(backupDirectory, `${type}_${date}.csv`);
  
      if (fs.existsSync(filePath)) {
        res.download(filePath);
      } else {
        res.status(HttpStatus.NOT_FOUND).send('Backup file not found');
      }
    }
  
    @Post('create')
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
  