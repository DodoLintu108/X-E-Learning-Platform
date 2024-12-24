import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { Quiz } from './quizzes.entity';
import { Response } from './responses.entity';

@Controller('courses/:courseId/quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async createQuiz(
    @Param('courseId') courseId: string,
    @Body() quizData: Partial<Quiz>,
  ): Promise<Quiz> {
    return this.quizzesService.createQuiz(courseId, quizData);
  }

  @Get()
  async getQuizzesForCourse(@Param('courseId') courseId: string): Promise<Quiz[]> {
    return this.quizzesService.getQuizzesForCourse(courseId);
  }

  @Get(':quizId')
  async getQuizById(@Param('quizId') quizId: string): Promise<Quiz> {
    return this.quizzesService.getQuizById(quizId);
  }

  @Delete(':quizId')
  async deleteQuiz(@Param('quizId') quizId: string): Promise<void> {
    return this.quizzesService.deleteQuiz(quizId);
  }

  @Post(':quizId/submit')
  async submitQuizResponse(
    @Param('quizId') quizId: string,
    @Body() responseData: Partial<Response>,
  ): Promise<Response> {
    return this.quizzesService.submitQuizResponse({ ...responseData, quizId });
  }
}
