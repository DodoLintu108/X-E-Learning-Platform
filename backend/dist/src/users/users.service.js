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
const users_entity_2 = require("./users.entity");
let UsersService = class UsersService {
    constructor(userModel, logModel, coursesService) {
        this.userModel = userModel;
        this.logModel = logModel;
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
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateUser(userId, updateData) {
        const user = await this.userModel.findOne({ userId }).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateData.name)
            user.name = updateData.name;
        if (updateData.email)
            user.email = updateData.email;
        if (updateData.role)
            user.role = updateData.role;
        if (updateData.learningPreference) {
            user.learningPreference = updateData.learningPreference;
        }
        if (updateData.subjectsOfInterest) {
            user.subjectsOfInterest = updateData.subjectsOfInterest;
        }
        return user.save();
    }
    async getDashboard(user) {
        if (user.role === 'student') {
            const enrolledCourses = await this.getEnrolledCourses(user.userId);
            const userPreferences = await this.findById(user.userId);
            return {
                message: `Welcome to your student dashboard, ${user.name}`,
                role: user.role,
                enrolledCourses,
                learningPreference: userPreferences.learningPreference,
                subjectsOfInterest: userPreferences.subjectsOfInterest,
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
            throw new common_1.NotFoundException('Invalid role');
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
    async deleteTeacher(userId) {
        const user = await this.userModel.findOne({ _id: userId, role: 'teacher' });
        if (!user) {
            throw new common_1.NotFoundException('Teacher not found');
        }
        await this.userModel.deleteOne({ _id: userId });
        return true;
    }
    async deleteStudent(userId) {
        const user = await this.userModel.findOne({ _id: userId, role: 'student' }).exec();
        if (!user) {
            throw new common_1.NotFoundException('Student not found');
        }
        await this.userModel.deleteOne({ _id: userId });
    }
    async deleteUser(userId) {
        const result = await this.userModel.findByIdAndDelete(userId);
        if (!result) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async findAllByRole(role) {
        return this.userModel.find({ role })
            .select('-passwordHash')
            .exec();
    }
    async logFailedLogin(userId, ipAddress) {
        const user = await this.userModel.findOne({ userId });
        if (user) {
            user.failedLoginAttempts += 1;
            user.unauthorizedAccessLogs.push({
                date: new Date(),
                ipAddress,
            });
            await user.save();
        }
    }
    async resetFailedLogin(userId) {
        await this.userModel.findOneAndUpdate({ userId }, { failedLoginAttempts: 0 });
    }
    async getFailedLoginAttempts(userId) {
        const user = await this.userModel.findOne({ userId });
        return user ? user.failedLoginAttempts : 0;
    }
    async getUnauthorizedLogs(userId) {
        const user = await this.userModel.findOne({ userId });
        return user ? user.unauthorizedAccessLogs : [];
    }
    async resetFailedLogins(userId, role) {
        const user = await this.userModel.findOne({ _id: userId, role });
        if (!user)
            return false;
        user.failedLoginAttempts = 0;
        await user.save();
        return true;
    }
    async getUserLogs(userId) {
        return this.logModel.find({ userId }).exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_entity_2.Log.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        courses_service_1.CoursesService])
], UsersService);
//# sourceMappingURL=users.service.js.map