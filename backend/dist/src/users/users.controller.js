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
const auth_guard_1 = require("../auth/auth.guard");
let UsersController = class UsersController {
    constructor(usersService, coursesService) {
        this.usersService = usersService;
        this.coursesService = coursesService;
    }
    async getAllUsers() {
        return this.usersService.getAllUsers();
    }
    async getAllTeachers() {
        return this.usersService.getAllTeachers();
    }
    async getAllStudents() {
        return this.usersService.getAllStudents();
    }
    async deleteUser(userId) {
        return this.usersService.deleteUser(userId);
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
    async findById(userId) {
        console.log(userId);
        const courses = await this.usersService.findById(userId);
        return courses;
    }
    async editUser(userId, updateData) {
        console.log('User ID:', userId);
        console.log('Update Data:', updateData);
        const updatedUser = await this.usersService.editUser(userId, updateData);
        return updatedUser;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('teachers'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllTeachers", null);
__decorate([
    (0, common_1.Get)('students'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllStudents", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
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
    (0, roles_decorator_1.Roles)('teacher'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createCourse", null);
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
], UsersController.prototype, "editUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        courses_service_1.CoursesService])
], UsersController);
//# sourceMappingURL=users.controller.js.map