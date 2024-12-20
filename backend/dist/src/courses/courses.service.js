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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const courses_entity_1 = require("./courses.entity");
const modules_entity_1 = require("./modules.entity");
const version_entity_1 = require("./version.entity");
let CoursesService = class CoursesService {
    constructor(courseModel, moduleModel, versionModel) {
        this.courseModel = courseModel;
        this.moduleModel = moduleModel;
        this.versionModel = versionModel;
    }
    async createCourse(data) {
        console.log('aa');
        const newCourse = new this.courseModel(data);
        return newCourse.save();
    }
    async addModule(data) {
        const course = await this.courseModel.findById(data.courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const newModule = new this.moduleModel(data);
        return newModule.save();
    }
    async updateCourse(courseId, data, updatedBy) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const version = new this.versionModel({
            courseId,
            updatedBy,
            changeSummary: `Course updated: ${Object.keys(data).join(', ')}`,
        });
        await version.save();
        Object.assign(course, data);
        return course.save();
    }
    async getCourseVersions(courseId) {
        return this.versionModel.find({ courseId }).sort({ updatedAt: -1 }).exec();
    }
    async getAllCourses() {
        const courses = await this.courseModel.find().exec();
        const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}`;
        return courses.map((course) => {
            if (course.courseImage) {
                course.courseImage = `${baseUrl}/uploads/${course.courseImage}`;
            }
            if (course.courseMaterial) {
                course.courseMaterial = `${baseUrl}/uploads/${course.courseMaterial}`;
            }
            return course;
        });
    }
    async searchCourses(query) {
        return this.courseModel
            .find({ title: { $regex: query, $options: 'i' } })
            .exec();
    }
    async enrollStudent(courseId, studentId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        if (!course.enrolledStudents.includes(studentId)) {
            course.enrolledStudents.push(studentId);
            return course.save();
        }
        throw new common_1.ForbiddenException('Student already enrolled');
    }
    async deleteCourse(courseId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        await this.moduleModel.deleteMany({ courseId });
        await this.versionModel.deleteMany({ courseId });
        await this.courseModel.findByIdAndDelete(courseId);
        return true;
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(courses_entity_1.Course.name)),
    __param(1, (0, mongoose_1.InjectModel)(modules_entity_1.Module.name)),
    __param(2, (0, mongoose_1.InjectModel)(version_entity_1.Version.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CoursesService);
//# sourceMappingURL=courses.service.js.map