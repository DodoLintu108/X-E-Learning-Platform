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
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_config_1 = require("../../multer.config");
const courses_service_1 = require("./courses.service");
const create_course_dto_1 = require("./create-course.dto");
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async createCourse(createCourseDto, files) {
        const courseMaterial = files.files?.[0]?.filename || null;
        const courseImage = files.imagefiles?.[0]?.filename || null;
        const courseData = {
            ...createCourseDto,
            courseMaterial,
            courseImage,
        };
        const newCourse = await this.coursesService.createCourse(courseData);
        return {
            message: 'Course created successfully',
            course: newCourse,
            files: {
                material: courseMaterial,
                image: courseImage,
            },
        };
    }
    async getStudentCourses(req) {
        const userId = req.user.userId;
        const assignedCourses = await this.coursesService.getAssignedCourses(userId);
        const availableCourses = await this.coursesService.getAvailableCourses(userId);
        return { assigned: assignedCourses, available: availableCourses };
    }
    async getTeacherCourses(req) {
        const userId = req.user.userId;
        return this.coursesService.getCoursesByTeacher(userId);
    }
    async addModule(courseId, body) {
        const moduleData = { courseId, ...body };
        return this.coursesService.addModule(moduleData);
    }
    async searchCourses(query) {
        return this.coursesService.searchCourses(query);
    }
    async getAllCourses() {
        return this.coursesService.getAllCourses();
    }
    async getCourseById(courseId) {
        return this.coursesService.getCourseById(courseId);
    }
    async getCourses(roleOrId) {
        if (roleOrId === 'admin') {
            return this.coursesService.getAllCourses();
        }
        else if (mongoose_1.default.Types.ObjectId.isValid(roleOrId)) {
            return this.coursesService.getCourseById(roleOrId);
        }
        else {
            throw new common_1.BadRequestException('Invalid parameter.');
        }
    }
    async getCourseByCategory(category) {
        return this.coursesService.getCourseByCategory(category);
    }
    async updateCourse(courseId, body) {
        return this.coursesService.updateCourse(courseId, body);
    }
    async getCourseVersions(courseId) {
        return this.coursesService.getCourseVersions(courseId);
    }
    async deleteCourse(courseId) {
        const result = await this.coursesService.deleteCourse(courseId);
        if (result) {
            return {
                message: 'Course deleted successfully',
            };
        }
        return {
            message: 'Course not found',
        };
    }
    async getCoursesByRole(role) {
        return this.coursesService.getCoursesByRole(role);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'files', maxCount: 2 },
        { name: 'imagefiles', maxCount: 2 },
    ], multer_config_1.multerOptions)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Create a new course with materials and image',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                category: { type: 'string' },
                difficultyLevel: { type: 'string' },
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
                imagefiles: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Get)('student'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getStudentCourses", null);
__decorate([
    (0, common_1.Get)('teacher'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getTeacherCourses", null);
__decorate([
    (0, common_1.Post)(':courseId/modules'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "addModule", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "searchCourses", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getAllCourses", null);
__decorate([
    (0, common_1.Get)(':courseId'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseById", null);
__decorate([
    (0, common_1.Get)(':roleOrId'),
    __param(0, (0, common_1.Param)('roleOrId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourses", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseByCategory", null);
__decorate([
    (0, common_1.Put)(':courseId'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "updateCourse", null);
__decorate([
    (0, common_1.Get)(':courseId/versions'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseVersions", null);
__decorate([
    (0, common_1.Delete)(':courseId'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "deleteCourse", null);
__decorate([
    (0, common_1.Get)('role/:role'),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByRole", null);
exports.CoursesController = CoursesController = __decorate([
    (0, common_1.Controller)('courses'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map