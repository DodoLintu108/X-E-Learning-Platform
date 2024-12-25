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
exports.BackupController = void 0;
const common_1 = require("@nestjs/common");
const backup_service_1 = require("./backup.service");
const path = require("path");
const fs = require("fs");
let BackupController = class BackupController {
    constructor(backupService) {
        this.backupService = backupService;
    }
    async downloadBackup(type, res) {
        const date = new Date().toISOString().split('T')[0];
        const backupDirectory = path.join(__dirname, '..', 'backups');
        const filePath = path.join(backupDirectory, `${type}_${date}.csv`);
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        }
        else {
            res.status(common_1.HttpStatus.NOT_FOUND).send('Backup file not found');
        }
    }
    async createBackup() {
        try {
            const backupPath = await this.backupService.backupDatabase();
            return { message: 'Backup created successfully', path: backupPath };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to create backup', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.BackupController = BackupController;
__decorate([
    (0, common_1.Get)('download/:type'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "downloadBackup", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createBackup", null);
exports.BackupController = BackupController = __decorate([
    (0, common_1.Controller)('backup'),
    __metadata("design:paramtypes", [backup_service_1.BackupService])
], BackupController);
//# sourceMappingURL=backup.controller.js.map