import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getStudentMetrics(studentId: string): Promise<{
        completionRate: number;
        averageScore: number;
        engagementTrends: {
            modules: string[];
            timeSpent: number[];
        };
    }>;
    getInstructorAnalytics(instructorId: string): Promise<{
        studentEngagement: number;
        assessmentResults: {
            passed: number;
            failed: number;
        };
        contentEffectiveness: {
            quizId: string;
            difficulty: string;
            averageScore: number;
        }[];
    }>;
    getDownloadableReport(instructorId: string): Promise<{
        reportUrl: string;
    }>;
}
