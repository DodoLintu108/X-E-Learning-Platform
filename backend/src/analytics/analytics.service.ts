import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Analytics } from './analytics.schema';
import { Course } from 'src/courses/courses.entity';

@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(Analytics.name) private analyticsModel: Model<Analytics>,
  @InjectModel(Course.name) private readonly courseModel: Model<Course>,
) { }

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
  async getCourseAverageScore(courseId: string): Promise<{
    average: number;
    levelStats: Record<string, { average: number; totalQuizzes: number }>;
  }> {
    // 1) Find the course by _id or by a custom courseId
    //    If your DB uses a different field, adapt this line (e.g. findOne({ courseId }))
    const course = await this.courseModel.findById(courseId).lean();
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    let totalCorrect = 0;
    let totalPossible = 0;
  
    // Instead of totalSubmissions, we do:
    course.lectures?.forEach((lecture) => {
      lecture.quizzes?.forEach((quiz) => {
        const quizQuestions = quiz.questions?.length || 0;
  
        // Sum all submissions for this quiz
        quiz.submittedBy?.forEach((submission) => {
          // "submission.score" = how many correct answers user got
          totalCorrect += submission.score;
          totalPossible += quizQuestions; 
        });
      });
    });
  
    const fractionCorrect = totalPossible > 0 ? totalCorrect / totalPossible : 0;
    
    // If you still want "levelStats," you'd do the same approach
    // but grouped by quiz.level. 
    // For each quiz submission, you'd add submission.score => that level's totalCorrect, 
    // add quizQuestions => that level's totalPossible.
  
    return { 
      average: fractionCorrect, 
      levelStats: { /* or similarly computed */ } 
    };
  }

  async getQuizAnalytics(quizId: string): Promise<number> {
    // 1. Find the course that contains the quiz with the given quizId
    //    Because each course has `lectures[].quizzes[]`, we can search all courses
    const course = await this.courseModel.findOne({
      'lectures.quizzes.quizId': quizId,
    });

    if (!course) {
      return 0; // or throw an exception if you prefer
    }

    // 2. Find the quiz inside the course
    let targetQuiz = null;
    for (const lecture of course.lectures) {
      const foundQuiz = lecture.quizzes.find((q) => q.quizId === quizId);
      if (foundQuiz) {
        targetQuiz = foundQuiz;
        break;
      }
    }

    if (!targetQuiz || !targetQuiz.submittedBy?.length) {
      return 0; // If no submissions yet
    }

    // 3. Calculate the average score
    let totalScore = 0;
    let totalSubmissions = 0;
    for (const submission of targetQuiz.submittedBy) {
      totalScore += submission.score;
      totalSubmissions++;
    }

    return totalScore / totalSubmissions;
  }

async getStudentAnalytics(courseId: string, userId: string): Promise<{ averageScore: number }> {
  const course = await this.courseModel.findById(courseId).lean();
  if (!course) {
    throw new NotFoundException('Course not found');
  }

  let totalCorrect = 0;
  let totalPossible = 0;

  // Iterate through lectures and quizzes
  course.lectures?.forEach((lecture) => {
    lecture.quizzes?.forEach((quiz) => {
      
      // 1. Get student's submission for this quiz
      const submission = quiz.submittedBy?.find((s) => s.userId === userId);
      
      // 2. If the student submitted the quiz, calculate score
      if (submission) {
        totalCorrect += submission.score;  // Add user's score
        totalPossible += quiz.questions?.length || 0;  // Count the quiz questions
      }
    });
  });

  // Average is based on submitted quizzes, not total quizzes
  const averageScore = (totalPossible > 0)
    ? (totalCorrect / totalPossible)  // Corrected here - no need to multiply by 100
    : 0;

  return { averageScore };
}

}
