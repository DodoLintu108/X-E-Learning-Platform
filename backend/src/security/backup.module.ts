// src/security/backup/backup.module.ts
import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from 'src/courses/courses.entity';
import { UserSchema, User } from 'src/users/users.entity';
@Module({
    imports: [

        MongooseModule.forFeature([
            { name: Course.name, schema: CourseSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [BackupController],
    providers: [BackupService],
})
export class BackupModule { }
