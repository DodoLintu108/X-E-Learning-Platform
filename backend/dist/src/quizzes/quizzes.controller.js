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
exports.QuizzesController = void 0;
const common_1 = require("@nestjs/common");
const quizzes_service_1 = require("./quizzes.service");
let QuizzesController = class QuizzesController {
    constructor(quizzesService) {
        this.quizzesService = quizzesService;
    }
    async createQuiz(courseId, quizData) {
        return this.quizzesService.createQuiz(courseId, quizData);
    }
    async getUnsubmittedQuizzes(courseId, req) {
        const userId = req.user.userId;
        return this.quizzesService.getUnsubmittedQuizzes(userId, courseId);
    }
    async getQuizzesForCourse(courseId) {
        return this.quizzesService.getQuizzesForCourse(courseId);
    }
    async getQuizById(quizId) {
        return this.quizzesService.getQuizById(quizId);
    }
    async deleteQuiz(quizId) {
        return this.quizzesService.deleteQuiz(quizId);
    }
    async submitQuizResponse(quizId, responseData) {
        return this.quizzesService.submitQuizResponse({ ...responseData, quizId });
    }
    async getAllQuizzes(courseId) {
        return this.quizzesService.getQuizzesForCourse(courseId);
    }
};
exports.QuizzesController = QuizzesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "createQuiz", null);
__decorate([
    (0, common_1.Get)(':courseId/quizzes/unsubmitted'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "getUnsubmittedQuizzes", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "getQuizzesForCourse", null);
__decorate([
    (0, common_1.Get)(':quizId'),
    __param(0, (0, common_1.Param)('quizId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "getQuizById", null);
__decorate([
    (0, common_1.Delete)(':quizId'),
    __param(0, (0, common_1.Param)('quizId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "deleteQuiz", null);
__decorate([
    (0, common_1.Post)(':quizId/submit'),
    __param(0, (0, common_1.Param)('quizId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "submitQuizResponse", null);
__decorate([
    (0, common_1.Get)(':courseId/quizzes'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "getAllQuizzes", null);
exports.QuizzesController = QuizzesController = __decorate([
    (0, common_1.Controller)('courses/:courseId/quizzes'),
    __metadata("design:paramtypes", [quizzes_service_1.QuizzesService])
], QuizzesController);
//# sourceMappingURL=quizzes.controller.js.map