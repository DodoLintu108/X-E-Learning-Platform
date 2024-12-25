import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Analytics } from './analytics.schema';

@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(Analytics.name) private analyticsModel: Model<Analytics>) {}

  // Average quiz score for a course
  async getAverageQuizScore(courseId: string): Promise<number> {
    const analytics = await this.analyticsModel
      .find({ 'contentEffectiveness.courseId': courseId })
      .lean();

    if (!analytics.length) return 0;

    const totalScore = analytics.reduce((sum, entry) => {
      return sum + entry.contentEffectiveness.reduce((quizSum, quiz) => quizSum + quiz.averageScore, 0);
    }, 0);

    const totalQuizzes = analytics.reduce((count, entry) => {
      return count + entry.contentEffectiveness.length;
    }, 0);

    console.log(`Total Score: ${totalScore}, Total Quizzes: ${totalQuizzes}`); // Debug log

    return totalScore / totalQuizzes;
  }

  // Course average score (all quizzes combined / total quizzes)
  async getCourseAverageScore(courseId: string): Promise<{ average: number; levelStats: any }> {
    // Fetch quizzes linked to the course
    const quizzes = await this.analyticsModel.find({ moduleId: courseId }).lean();
  
    if (!quizzes.length) return { average: 0, levelStats: {} };
  
    const scoresByLevel: Record<string, { totalScore: number; count: number }> = {};
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
  

}
