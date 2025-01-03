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
        const newCourse = new this.courseModel({
            ...data,
            isEnded: data.isEnded ?? false,
        });
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
        if (updatedBy) {
            const version = new this.versionModel({
                courseId,
                updatedBy,
                changeSummary: `Course updated: ${Object.keys(data).join(', ')}`,
            });
            await version.save();
        }
        Object.assign(course, data);
        return course.save();
    }
    async getAssignedCourses(studentId) {
        return this.courseModel.find({ enrolledStudents: studentId }).exec();
    }
    async getAvailableCourses(studentId) {
        return this.courseModel.find({ enrolledStudents: { $ne: studentId } }).exec();
    }
    async getCoursesByTeacher(teacherId) {
        return this.courseModel.find({ createdBy: teacherId }).exec();
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
    async getCourseById(courseId) {
        const course = await this.courseModel.findById(courseId).exec();
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}`;
        if (course.courseImage) {
            course.courseImage = `${baseUrl}/uploads/${course.courseImage}`;
        }
        if (course.courseMaterial) {
            course.courseMaterial = `${baseUrl}/uploads/${course.courseMaterial}`;
        }
        return course;
    }
    async getCourseByCategory(category) {
        const courses = await this.courseModel.find({ category }).exec();
        if (!courses || courses.length === 0) {
            throw new common_1.NotFoundException('Course not found');
        }
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
        const courses = await this.courseModel
            .find({ title: { $regex: query, $options: 'i' } })
            .exec();
        if (!courses || courses.length === 0) {
            throw new common_1.NotFoundException('Course not found');
        }
        const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}`;
        return courses.map((course) => ({
            ...course.toObject(),
            courseImage: course.courseImage
                ? `${baseUrl}/uploads/${course.courseImage}`
                : null,
            courseMaterial: course.courseMaterial
                ? `${baseUrl}/uploads/${course.courseMaterial}`
                : null,
        }));
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
    async getCoursesByRole(role) {
        const roleCriteria = {};
        if (role === 'student')
            roleCriteria.forStudents = true;
        else if (role === 'teacher')
            roleCriteria.forTeachers = true;
        else if (role === 'admin')
            roleCriteria.forAdmins = true;
        else
            throw new common_1.NotFoundException('Invalid role');
        const courses = await this.courseModel.find(roleCriteria).exec();
        const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}`;
        return courses.map((course) => ({
            ...course.toObject(),
            courseImage: course.courseImage
                ? `${baseUrl}/uploads/${course.courseImage}`
                : null,
            courseMaterial: course.courseMaterial
                ? `${baseUrl}/uploads/${course.courseMaterial}`
                : null,
        }));
    }
    async addQuizToCourse(courseId, quizData) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const newQuiz = {
            quizId: new Date().toISOString(),
            title: quizData.title || 'Untitled Quiz',
            level: quizData.level,
            questions: quizData.questions,
            submittedBy: [],
            createdAt: new Date(),
        };
        const targetLecture = course.lectures[course.lectures.length - 1];
        if (!targetLecture) {
            throw new common_1.NotFoundException('No lectures found in the course to add the quiz.');
        }
        targetLecture.quizzes.push(newQuiz);
        await course.save();
        return newQuiz;
    }
    async getCourseDetailsForStudent(courseId, studentId) {
        const course = await this.courseModel.findById(courseId).exec();
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const quizzes = course.lectures.flatMap((lecture) => lecture.quizzes || []);
        const submissions = quizzes.flatMap((quiz) => quiz.submittedBy.filter((submission) => submission.userId === studentId));
        const totalScore = submissions.reduce((sum, sub) => sum + sub.score, 0);
        const averageScore = submissions.length ? totalScore / submissions.length : 0;
        return {
            title: course.title,
            description: course.description,
            category: course.category,
            difficultyLevel: course.difficultyLevel,
            teacherName: course.createdBy,
            lectures: course.lectures,
            createdAt: course.createdAt,
            isEnded: course.isEnded,
            averageScore: averageScore.toFixed(2),
        };
    }
    async endCourse(id) {
        return this.courseModel.findByIdAndUpdate(id, { isEnded: true }, { new: true }).exec();
    }
    async submitQuizResponse(courseId, quizId, userId, answers) {
        try {
            const course = await this.courseModel.findById(courseId);
            if (!course) {
                throw new common_1.NotFoundException('Course not found');
            }
            const quiz = course.lectures
                .flatMap((lecture) => lecture.quizzes || [])
                .find((quiz) => quiz.quizId === quizId);
            if (!quiz) {
                throw new common_1.NotFoundException('Quiz not found');
            }
            const totalQuestions = quiz.questions.length;
            const correctAnswers = quiz.questions.map((q) => q.correctAnswer);
            const correctCount = answers.reduce((total, answer, index) => {
                const isCorrect = answer.answer === correctAnswers[index];
                return total + (isCorrect ? 1 : 0);
            }, 0);
            const score = ((correctCount / totalQuestions) * 100).toFixed(2);
            const existingSubmission = quiz.submittedBy.find((submission) => submission.userId === userId);
            if (existingSubmission) {
                existingSubmission.score = Number(score);
                existingSubmission.submittedAt = new Date();
            }
            else {
                quiz.submittedBy.push({
                    userId,
                    score: Number(score),
                    submittedAt: new Date(),
                });
            }
            const result = await this.courseModel.updateOne({ _id: courseId, 'lectures.quizzes.quizId': quizId }, { $set: { 'lectures.$[l].quizzes.$[q].submittedBy': quiz.submittedBy } }, {
                arrayFilters: [
                    { 'l.quizzes.quizId': quizId },
                    { 'q.quizId': quizId },
                ],
            });
            if (result.modifiedCount === 0) {
                console.log('Failed to update quiz submission:', result);
                throw new Error('Failed to update quiz submission.');
            }
            return { score: Number(score) };
        }
        catch (error) {
            console.error('Error during quiz submission:', error.message);
            throw new common_1.HttpException(`Quiz submission failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getQuizzesByCourse(courseId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const quizzes = course.lectures.flatMap((lecture) => lecture.quizzes || []);
        return quizzes;
    }
    async getQuizById(courseId, quizId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const quiz = course.lectures
            .flatMap((lecture) => lecture.quizzes || [])
            .find((q) => q.quizId === quizId);
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz not found');
        }
        return quiz;
    }
    async deleteQuiz(courseId, quizId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        course.lectures.forEach((lecture) => {
            if (lecture.quizzes) {
                lecture.quizzes = lecture.quizzes.filter((quiz) => quiz.quizId !== quizId);
            }
        });
        await course.save();
        return course;
    }
    async addLecture(courseId, lectureData) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const lecture = {
            title: lectureData.title,
            type: lectureData.type,
            content: lectureData.content,
            createdAt: new Date(),
            quizzes: [],
        };
        course.lectures.push(lecture);
        await course.save();
        return course;
    }
    async getCourseDetails(courseId) {
        const course = await this.courseModel.findById(courseId).exec();
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return {
            title: course.title,
            description: course.description,
            category: course.category,
            difficultyLevel: course.difficultyLevel,
            teacherName: course.createdBy,
            lectures: course.lectures,
            createdAt: course.createdAt,
            isEnded: { type: Boolean, default: false },
        };
    }
    async getAllQuizzesForCourse(courseId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const quizzes = course.lectures.flatMap((lecture) => lecture.quizzes || []);
        return quizzes;
    }
    async editCourse(courseId, updateData) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        Object.assign(course, updateData);
        return await course.save();
    }
    async deleteCourseById(courseId) {
        const result = await this.courseModel.findByIdAndDelete(courseId);
        if (!result) {
            throw new common_1.NotFoundException('Course not found');
        }
    }
    async updateQuiz(courseId, lectureId, quizId, quizUpdateData) {
        const course = await this.courseModel.findById(courseId).exec();
        if (!course) {
            return null;
        }
        const lecture = course.lectures.find((lec) => lec._id.toString() === lectureId);
        if (!lecture) {
            return null;
        }
        const quiz = lecture.quizzes.find((q) => q.quizId === quizId);
        if (!quiz) {
            return null;
        }
        if (quizUpdateData.title)
            quiz.title = quizUpdateData.title;
        if (quizUpdateData.level)
            quiz.level = quizUpdateData.level;
        if (quizUpdateData.questions)
            quiz.questions = quizUpdateData.questions;
        await course.save();
        return course;
    }
    async submitFeedback(courseId, userId, comment) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        if (!course.isEnded) {
            throw new common_1.NotFoundException('Course is still ongoing.');
        }
        course.feedback.push({
            userId,
            comment,
            submittedAt: new Date(),
        });
        await course.save();
        return { message: 'Feedback submitted successfully' };
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