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
let AnalyticsService = class AnalyticsService {
    constructor(analyticsModel) {
        this.analyticsModel = analyticsModel;
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
        const quizzes = await this.analyticsModel.find({ moduleId: courseId }).lean();
        if (!quizzes.length)
            return { average: 0, levelStats: {} };
        const scoresByLevel = {};
        let totalScore = 0;
        let totalQuizzes = 0;
        quizzes.forEach((quiz) => {
            if (quiz.submittedBy?.length > 0) {
                quiz.submittedBy.forEach((submission) => {
                    totalScore += submission.score;
                    totalQuizzes++;
                    if (!scoresByLevel[quiz.level]) {
                        scoresByLevel[quiz.level] = { totalScore: 0, count: 0 };
                    }
                    scoresByLevel[quiz.level].totalScore += submission.score;
                    scoresByLevel[quiz.level].count++;
                });
            }
        });
        const levelStats = Object.entries(scoresByLevel).reduce((acc, [level, data]) => {
            acc[level] = {
                average: data.totalScore / data.count,
                totalQuizzes: data.count,
            };
            return acc;
        }, {});
        return {
            average: totalScore / totalQuizzes,
            levelStats,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(analytics_schema_1.Analytics.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map