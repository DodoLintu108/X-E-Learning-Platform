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
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const file_service_1 = require("./file.service");
let FilesController = class FilesController {
    constructor(filesService) {
        this.filesService = filesService;
    }
    async uploadImage(image) {
        try {
            return await this.filesService.handleImageUpload(image);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async uploadFile(file) {
        try {
            return await this.filesService.handleFileUpload(file);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async seeUploadedFile(filename, res) {
        try {
            const filePath = await this.filesService.downloadFile(filename);
            return res.sendFile(filePath);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async seeUploadedImage(imagePath, res) {
        try {
            const filePath = await this.filesService.downloadFile(imagePath);
            return res.sendFile(filePath);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)('uploadImage'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('image')),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('uploadFile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('file')),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('download/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "seeUploadedFile", null);
__decorate([
    (0, common_1.Get)('download-image/:imagePath'),
    __param(0, (0, common_1.Param)('imagePath')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "seeUploadedImage", null);
exports.FilesController = FilesController = __decorate([
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [file_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map