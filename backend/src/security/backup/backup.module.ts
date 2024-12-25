// src/security/backup/backup.module.ts
import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from '../../courses/courses.entity'; // Adjusted path for Course entity
import { User, UserSchema } from '../../users/users.entity'; // Adjusted path for User entity
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        ScheduleModule.forRoot(), // Enables scheduling if you plan to use cron jobs for backups
        MongooseModule.forFeature([
            { name: Course.name, schema: CourseSchema }, // Register Course schema
            { name: User.name, schema: UserSchema }, // Register User schema
        ]),
    ],
    controllers: [BackupController], // Register the BackupController
    providers: [BackupService], // Register the BackupService
})
export class BackupModule {}
