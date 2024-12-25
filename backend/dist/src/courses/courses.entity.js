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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseSchema = exports.Course = exports.LectureSchema = exports.Lecture = exports.Quiz = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const uuid_1 = require("uuid");
let Quiz = class Quiz {
};
exports.Quiz = Quiz;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Quiz.prototype, "quizId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Quiz.prototype, "moduleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Quiz.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                question: { type: String, required: true },
                options: { type: [String], required: true },
                correctAnswer: { type: Number, required: true },
            },
        ],
    }),
    __metadata("design:type", Array)
], Quiz.prototype, "questions", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                userId: { type: String, required: true },
                score: { type: Number, required: true },
                submittedAt: { type: Date, default: Date.now },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Quiz.prototype, "submittedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Quiz.prototype, "createdAt", void 0);
exports.Quiz = Quiz = __decorate([
    (0, mongoose_1.Schema)()
], Quiz);
let Lecture = class Lecture {
};
exports.Lecture = Lecture;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lecture.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['video', 'pdf'] }),
    __metadata("design:type", String)
], Lecture.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Quiz], default: [] }),
    __metadata("design:type", Array)
], Lecture.prototype, "quizzes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lecture.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Lecture.prototype, "createdAt", void 0);
exports.Lecture = Lecture = __decorate([
    (0, mongoose_1.Schema)()
], Lecture);
exports.LectureSchema = mongoose_1.SchemaFactory.createForClass(Lecture);
let Course = class Course {
};
exports.Course = Course;
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: uuid_1.v4 }),
    __metadata("design:type", String)
], Course.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Course.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Course.prototype, "difficultyLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Course.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: [] }),
    __metadata("design:type", Array)
], Course.prototype, "enrolledStudents", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'default-image.jpg' }),
    __metadata("design:type", String)
], Course.prototype, "courseImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Course.prototype, "courseMaterial", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Course.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.LectureSchema], default: [] }),
    __metadata("design:type", Array)
], Course.prototype, "lectures", void 0);
exports.Course = Course = __decorate([
    (0, mongoose_1.Schema)()
], Course);
exports.CourseSchema = mongoose_1.SchemaFactory.createForClass(Course);
//# sourceMappingURL=courses.entity.js.map