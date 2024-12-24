import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
  ) { }

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

  async submitQuizResponse(responseData: Partial<Response>): Promise<{ message: string; score: number }> {
    const { quizId, userId, answers } = responseData;
  
    // Check if the user has already submitted this quiz
    const existingResponse = await this.responseModel.findOne({ quizId, userId }).exec();
    if (existingResponse) {
      throw new ForbiddenException('You have already submitted this quiz.');
    }
  
    // Fetch the quiz to grade
    const quiz = await this.quizModel.findById(quizId).exec();
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    // Grade the quiz
    const correctAnswers: number[] = quiz.questions.map((q) => q.correctAnswer);
  
    const score = answers.reduce((acc, { answer }, index) => {
      return acc + (answer === correctAnswers[index] ? 1 : 0);
    }, 0);
  
    // Save the response
    const response = new this.responseModel({
      quizId,
      userId,
      answers,
      submittedAt: new Date(),
    });
    await response.save();
  
    // Update the quiz's submittedBy array
    await this.quizModel.updateOne(
      { _id: quizId },
      { $addToSet: { submittedBy: userId } } // Add userId if not already present
    );
  
    return {
      message: 'Quiz submitted successfully',
      score,
    };
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
