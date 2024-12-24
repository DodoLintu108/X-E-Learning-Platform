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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_entity_1 = require("./users.entity");
const courses_service_1 = require("../courses/courses.service");
const common_2 = require("@nestjs/common");
let UsersService = class UsersService {
    constructor(userModel, coursesService) {
        this.userModel = userModel;
        this.coursesService = coursesService;
    }
    async createUser(userData) {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(userId) {
        const user = await this.userModel.findOne({ userId }).exec();
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        return user;
    }
    async getDashboard(user) {
        if (user.role === 'student') {
            const enrolledCourses = await this.getEnrolledCourses(user.userId);
            return {
                message: `Welcome to your student dashboard, ${user.name}`,
                role: user.role,
                enrolledCourses,
            };
        }
        else if (user.role === 'instructor') {
            const createdCourses = await this.getCreatedCourses(user.userId);
            return {
                message: `Welcome to your instructor dashboard, ${user.name}`,
                role: user.role,
                createdCourses,
            };
        }
        else if (user.role === 'admin') {
            const totalUsers = await this.getTotalUsers();
            const allCourses = await this.coursesService.getAllCourses();
            return {
                message: `Welcome to your admin dashboard, ${user.name}`,
                role: user.role,
                totalUsers,
                allCourses,
            };
        }
        else {
            throw new common_2.NotFoundException('Invalid role');
        }
    }
    async getEnrolledCourses(userId) {
        const courses = await this.coursesService.getAllCourses();
        return courses.filter((course) => course.enrolledStudents?.includes(userId));
    }
    async getCreatedCourses(userId) {
        const courses = await this.coursesService.getAllCourses();
        return courses.filter((course) => course.createdBy === userId);
    }
    async getTotalUsers() {
        return this.userModel.countDocuments();
    }
    async editUser(userId, updateData) {
        const user = await this.userModel.findOne({ userId: userId });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        Object.assign(user, updateData);
        await user.save();
        return user;
    async getAllUsers() {
        return this.userModel.find().exec();
    }
    async getAllTeachers() {
        return this.userModel.find({ role: 'teacher' }).exec();
    }
    async getAllStudents() {
        return this.userModel.find({ role: 'student' }).exec();
    }
    async deleteUser(userId) {
        const result = await this.userModel.deleteOne({ userId }).exec();
        if (result.deletedCount === 0) {
            throw new common_2.NotFoundException(`User with ID ${userId} not found`);
        }
        return { message: `User with ID ${userId} deleted successfully` };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        courses_service_1.CoursesService])
], UsersService);
//# sourceMappingURL=users.service.js.map