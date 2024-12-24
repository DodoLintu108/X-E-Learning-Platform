import { Controller, Post, Get, Param, Body, Delete, Req } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { Quiz } from './quizzes.entity';
import { Response } from './responses.entity';

@Controller('courses/:courseId/quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) { }

  @Post()
  async createQuiz(
    @Param('courseId') courseId: string,
    @Body() quizData: Partial<Quiz>,
  ): Promise<Quiz> {
    return this.quizzesService.createQuiz(courseId, quizData); // Correctly call the service method
  }
  @Get(':courseId/quizzes/unsubmitted')
  async getUnsubmittedQuizzes(
    @Param('courseId') courseId: string,
    @Req() req: any, // Get user from request
  ): Promise<Quiz[]> {
    const userId = req.user.userId; // Replace with actual user ID retrieval
    return this.quizzesService.getUnsubmittedQuizzes(userId, courseId);
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

  // In the controller
  @Post(':quizId/submit')
  async submitQuizResponse(
    @Param('quizId') quizId: string,
    @Body() responseData: Partial<Response>,
  ): Promise<{ message: string; score: number }> {
    return this.quizzesService.submitQuizResponse({ ...responseData, quizId });
  }
  
  
  
  @Get(':courseId/quizzes')
  async getAllQuizzes(@Param('courseId') courseId: string) {
    return this.quizzesService.getQuizzesForCourse(courseId);
  }



}
