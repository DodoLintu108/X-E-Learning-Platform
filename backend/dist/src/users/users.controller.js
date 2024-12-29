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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("./roles.decorator");
const users_service_1 = require("./users.service");
const courses_service_1 = require("../courses/courses.service");
const users_entity_1 = require("./users.entity");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UsersController = class UsersController {
    constructor(usersService, coursesService, userModel) {
        this.usersService = usersService;
        this.coursesService = coursesService;
        this.userModel = userModel;
    }
    getDashboard(req) {
        return this.usersService.getDashboard(req.user);
    }
    createCourse(req, courseData) {
        return this.coursesService.createCourse({
            ...courseData,
            createdBy: req.user.userId,
        });
    }
    async getAllStudents() {
        return this.usersService.findAllByRole('student');
    }
    async getAllTeachers() {
        return this.usersService.findAllByRole('teacher');
    }
    async findById(userId) {
        console.log(userId);
        const courses = await this.usersService.findById(userId);
        return courses;
    }
    async updateUser(userId, updateData) {
        return this.usersService.updateUser(userId, updateData);
    }
    async deleteUser(id) {
        await this.usersService.deleteUser(id);
        return { message: 'User deleted successfully' };
    }
    async resetFailedLogins(userId) {
        await this.usersService.resetFailedLogin(userId);
        return { message: 'Failed login attempts reset successfully' };
    }
    async getFailedLogins(userId) {
        const attempts = await this.usersService.getFailedLoginAttempts(userId);
        return { attempts };
    }
    async getAccessLogs(userId) {
        const logs = await this.usersService.getUnauthorizedLogs(userId);
        return { logs };
    }
    async deleteTeacher(id) {
        const deleted = await this.usersService.deleteTeacher(id);
        if (deleted) {
            return { message: 'Teacher deleted successfully' };
        }
        else {
            throw new common_1.NotFoundException('Teacher not found');
        }
    }
    async deleteStudent(id) {
        const deleted = await this.userModel.deleteOne({ _id: id });
        if (deleted.deletedCount > 0) {
            return { message: 'Student deleted successfully' };
        }
        else {
            throw new common_1.NotFoundException('Student not found');
        }
    }
    async getStudentLogs(id) {
        const logs = await this.usersService.getUserLogs(id);
        if (!logs) {
            throw new common_1.NotFoundException('Logs not found for student');
        }
        return logs;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)('view-dashboard'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)('create-course'),
    (0, roles_decorator_1.Roles)('create-courses'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Get)('students'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllStudents", null);
__decorate([
    (0, common_1.Get)('teachers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllTeachers", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Put)('user/:userId/reset-failed-logins'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetFailedLogins", null);
__decorate([
    (0, common_1.Get)('user/:userId/failed-logins'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFailedLogins", null);
__decorate([
    (0, common_1.Get)('user/:userId/access-logs'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAccessLogs", null);
__decorate([
    (0, common_1.Delete)('teachers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteTeacher", null);
__decorate([
    (0, common_1.Delete)('students/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteStudent", null);
__decorate([
    (0, common_1.Get)('students/:id/logs'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getStudentLogs", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __param(2, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        courses_service_1.CoursesService,
        mongoose_2.Model])
], UsersController);
//# sourceMappingURL=users.controller.js.map