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
exports.QuizzesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const quizzes_entity_1 = require("./quizzes.entity");
const responses_entity_1 = require("./responses.entity");
let QuizzesService = class QuizzesService {
    constructor(quizModel, responseModel) {
        this.quizModel = quizModel;
        this.responseModel = responseModel;
    }
    async createQuiz(courseId, quizData) {
        const quiz = new this.quizModel({ ...quizData, courseId });
        return quiz.save();
    }
    async getQuizzesForCourse(courseId) {
        return this.quizModel.find({ courseId }).exec();
    }
    async getQuizById(quizId) {
        const quiz = await this.quizModel.findOne({ quizId }).exec();
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz not found');
        }
        return quiz;
    }
    async deleteQuiz(quizId) {
        const result = await this.quizModel.deleteOne({ quizId }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Quiz not found');
        }
    }
    async submitQuizResponse(responseData) {
        const { quizId, userId, answers } = responseData;
        const existingResponse = await this.responseModel.findOne({ quizId, userId }).exec();
        if (existingResponse) {
            throw new common_1.ForbiddenException('You have already submitted this quiz.');
        }
        const quiz = await this.quizModel.findById(quizId).exec();
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz not found');
        }
        const correctAnswers = quiz.questions.map((q) => q.correctAnswer);
        const score = answers.reduce((acc, { answer }, index) => {
            return acc + (answer === correctAnswers[index] ? 1 : 0);
        }, 0);
        const response = new this.responseModel({
            quizId,
            userId,
            answers,
            submittedAt: new Date(),
        });
        await response.save();
        await this.quizModel.updateOne({ _id: quizId }, { $addToSet: { submittedBy: userId } });
        return {
            message: 'Quiz submitted successfully',
            score,
        };
    }
    async getUnsubmittedQuizzes(userId, courseId) {
        const quizzes = await this.quizModel.find({ courseId }).exec();
        const unsubmittedQuizzes = quizzes.filter((quiz) => !quiz.submittedBy.includes(userId));
        return unsubmittedQuizzes;
    }
};
exports.QuizzesService = QuizzesService;
exports.QuizzesService = QuizzesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(quizzes_entity_1.Quiz.name)),
    __param(1, (0, mongoose_1.InjectModel)(responses_entity_1.Response.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], QuizzesService);
//# sourceMappingURL=quizzes.service.js.map