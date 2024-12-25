import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './quizzes.entity';
import { Response, ResponseDocument } from './responses.entity';
import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    @InjectModel(Response.name) private responseModel: Model<ResponseDocument>,
  ) {}

  // Correct implementation of the createQuiz method
  async createQuiz(
    courseId: string,
    quizData: Partial<Quiz>,
  ): Promise<Quiz> {
    // Add the courseId to the quiz data
    const quiz = new this.quizModel({ ...quizData, courseId });
    return quiz.save(); // Save and return the created quiz
  }

  async getQuizzesForCourse(courseId: string): Promise<Quiz[]> {
    return this.quizModel.find({ courseId }).exec();
  }
  

  async getQuizById(quizId: string): Promise<Quiz> {
    const quiz = await this.quizModel.findOne({ quizId }).exec();
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  async deleteQuiz(quizId: string): Promise<void> {
    const result = await this.quizModel.deleteOne({ quizId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Quiz not found');
    }
  }

  async submitQuizResponse(responseData: Partial<Response>): Promise<Response> {
    const response = new this.responseModel(responseData);
    return response.save();
  }
  
  async getUnsubmittedQuizzes(userId: string, courseId: string): Promise<Quiz[]> {
    const quizzes = await this.quizModel.find({ courseId }).exec();
  
    // Filter quizzes where the user hasn't submitted
    const unsubmittedQuizzes = quizzes.filter(
      (quiz) => !quiz.submittedBy.includes(userId),
    );
  
    return unsubmittedQuizzes;
  }
  
  

}
