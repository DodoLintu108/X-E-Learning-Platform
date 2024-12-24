import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupService {
    constructor(
        @InjectModel('Course') private readonly coursesModel: Model<any>,
        @InjectModel('User') private readonly userModel: Model<any>
    ) { }

    async backupDatabase(): Promise<string> {
        const date = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        const backupDirectory = path.join(__dirname, 'backups');
        if (!fs.existsSync(backupDirectory)) {
            fs.mkdirSync(backupDirectory, { recursive: true });
        }
        const courseBackupPath = path.join(backupDirectory, `courses_${date}.json`);
        const userBackupPath = path.join(backupDirectory, `users_${date}.json`);

        try {
            const courses = await this.coursesModel.find().exec();
            const users = await this.userModel.find().exec();

            fs.writeFileSync(courseBackupPath, JSON.stringify(courses, null, 2), 'utf-8');
            fs.writeFileSync(userBackupPath, JSON.stringify(users, null, 2), 'utf-8');

            return `Backup created successfully at ${backupDirectory}`;
        } catch (error) {
            console.error('Backup error:', error);
            throw new Error('Failed to create backup');
        }
    }
}
