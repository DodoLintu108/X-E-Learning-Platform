"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_entity_1 = require("../../users/users.entity");
const courses_entity_1 = require("../../courses/courses.entity");
const json2csv_1 = require("json2csv");
let BackupService = class BackupService {
    constructor(userModel, courseModel) {
        this.userModel = userModel;
        this.courseModel = courseModel;
    }
    async backupDatabase() {
        const date = new Date().toISOString().split('T')[0];
        const backupDirectory = path.join(__dirname, '..', 'backups');
        if (!fs.existsSync(backupDirectory)) {
            fs.mkdirSync(backupDirectory);
        }
        const userBackup = await this.userModel.find().lean();
        const courseBackup = await this.courseModel.find().lean();
        const userFields = Object.keys(userBackup[0] || {});
        const courseFields = Object.keys(courseBackup[0] || {});
        const json2csvParser = new json2csv_1.Parser({ fields: userFields });
        const userCsv = json2csvParser.parse(userBackup);
        const courseCsvParser = new json2csv_1.Parser({ fields: courseFields });
        const courseCsv = courseCsvParser.parse(courseBackup);
        const userBackupPath = path.join(backupDirectory, `users_${date}.csv`);
        const courseBackupPath = path.join(backupDirectory, `courses_${date}.csv`);
        fs.writeFileSync(userBackupPath, userCsv);
        fs.writeFileSync(courseBackupPath, courseCsv);
        return backupDirectory;
    }
};
exports.BackupService = BackupService;
exports.BackupService = BackupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(courses_entity_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], BackupService);
//# sourceMappingURL=backup.service.js.map