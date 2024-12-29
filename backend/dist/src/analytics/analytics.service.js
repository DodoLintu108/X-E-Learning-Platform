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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const analytics_schema_1 = require("./analytics.schema");
const courses_entity_1 = require("../courses/courses.entity");
let AnalyticsService = class AnalyticsService {
    constructor(analyticsModel, courseModel) {
        this.analyticsModel = analyticsModel;
        this.courseModel = courseModel;
    }
    async getAverageQuizScore(courseId) {
        const analytics = await this.analyticsModel
            .find({ 'contentEffectiveness.courseId': courseId })
            .lean();
        if (!analytics.length)
            return 0;
        const totalScore = analytics.reduce((sum, entry) => {
            return sum + entry.contentEffectiveness.reduce((quizSum, quiz) => quizSum + quiz.averageScore, 0);
        }, 0);
        const totalQuizzes = analytics.reduce((count, entry) => {
            return count + entry.contentEffectiveness.length;
        }, 0);
        console.log(`Total Score: ${totalScore}, Total Quizzes: ${totalQuizzes}`);
        return totalScore / totalQuizzes;
    }
    async getCourseAverageScore(courseId) {
        const course = await this.courseModel.findById(courseId).lean();
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        let totalCorrect = 0;
        let totalPossible = 0;
        course.lectures?.forEach((lecture) => {
            lecture.quizzes?.forEach((quiz) => {
                const quizQuestions = quiz.questions?.length || 0;
                quiz.submittedBy?.forEach((submission) => {
                    totalCorrect += submission.score;
                    totalPossible += quizQuestions;
                });
            });
        });
        const fractionCorrect = totalPossible > 0 ? totalCorrect / totalPossible : 0;
        return {
            average: fractionCorrect,
            levelStats: {}
        };
    }
    async getQuizAnalytics(quizId) {
        const course = await this.courseModel.findOne({
            'lectures.quizzes.quizId': quizId,
        });
        if (!course) {
            return 0;
        }
        let targetQuiz = null;
        for (const lecture of course.lectures) {
            const foundQuiz = lecture.quizzes.find((q) => q.quizId === quizId);
            if (foundQuiz) {
                targetQuiz = foundQuiz;
                break;
            }
        }
        if (!targetQuiz || !targetQuiz.submittedBy?.length) {
            return 0;
        }
        let totalScore = 0;
        let totalSubmissions = 0;
        for (const submission of targetQuiz.submittedBy) {
            totalScore += submission.score;
            totalSubmissions++;
        }
        return totalScore / totalSubmissions;
    }
    async getStudentAnalytics(courseId, userId) {
        const course = await this.courseModel.findById(courseId).lean();
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        let totalCorrect = 0;
        let totalPossible = 0;
        course.lectures?.forEach((lecture) => {
            lecture.quizzes?.forEach((quiz) => {
                const submission = quiz.submittedBy?.find((s) => s.userId === userId);
                if (submission) {
                    totalCorrect += submission.score;
                    totalPossible += quiz.questions?.length || 0;
                }
            });
        });
        const averageScore = (totalPossible > 0)
            ? (totalCorrect / totalPossible)
            : 0;
        return { averageScore };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(analytics_schema_1.Analytics.name)),
    __param(1, (0, mongoose_1.InjectModel)(courses_entity_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map