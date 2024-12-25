import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../users/users.entity';
import { Course } from '../../courses/courses.entity';
import { Parser } from 'json2csv'; // Install json2csv with npm i json2csv

@Injectable()
export class BackupService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  async backupDatabase(): Promise<string> {
    const date = new Date().toISOString().split('T')[0];
    const backupDirectory = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDirectory)) {
      fs.mkdirSync(backupDirectory);
    }

    const userBackup = await this.userModel.find().lean();
    const courseBackup = await this.courseModel.find().lean();

    const userFields = Object.keys(userBackup[0] || {});
    const courseFields = Object.keys(courseBackup[0] || {});

    const json2csvParser = new Parser({ fields: userFields });
    const userCsv = json2csvParser.parse(userBackup);

    const courseCsvParser = new Parser({ fields: courseFields });
    const courseCsv = courseCsvParser.parse(courseBackup);

    const userBackupPath = path.join(backupDirectory, `users_${date}.csv`);
    const courseBackupPath = path.join(backupDirectory, `courses_${date}.csv`);

    fs.writeFileSync(userBackupPath, userCsv);
    fs.writeFileSync(courseBackupPath, courseCsv);

    return backupDirectory;
  }
}
