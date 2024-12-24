import { Document } from 'mongoose';
export type AnalyticsDocument = Analytics & Document;
export type QuizDocument = Quiz & Document;
export declare class Analytics {
    moduleId: string;
    submittedBy: Array<{
        userId: string;
        score: number;
        submittedAt: Date;
    }>;
    level: string;
    analyticsId: string;
    userId: string;
    completionPercentage?: number;
    averageScore?: number;
    engagementModules?: string[];
    engagementTime?: number[];
    assessmentResults?: Map<string, number>;
    contentEffectiveness?: Array<{
        quizId: string;
        difficulty: string;
        averageScore: number;
    }>;
    reportUrl?: string;
    createdAt: Date;
}
export declare class Quiz {
    moduleId: string;
    level: string;
    submittedBy: Array<{
        userId: string;
        score: number;
        submittedAt: Date;
    }>;
}
export declare const AnalyticsSchema: import("mongoose").Schema<Analytics, import("mongoose").Model<Analytics, any, any, any, Document<unknown, any, Analytics> & Analytics & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Analytics, Document<unknown, {}, import("mongoose").FlatRecord<Analytics>> & import("mongoose").FlatRecord<Analytics> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const QuizSchema: import("mongoose").Schema<Quiz, import("mongoose").Model<Quiz, any, any, any, Document<unknown, any, Quiz> & Quiz & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Quiz, Document<unknown, {}, import("mongoose").FlatRecord<Quiz>> & import("mongoose").FlatRecord<Quiz> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
