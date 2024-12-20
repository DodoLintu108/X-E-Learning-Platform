import { Document } from 'mongoose';
export type AnalyticsDocument = Analytics & Document;
export declare class Analytics {
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
export declare const AnalyticsSchema: import("mongoose").Schema<Analytics, import("mongoose").Model<Analytics, any, any, any, Document<unknown, any, Analytics> & Analytics & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Analytics, Document<unknown, {}, import("mongoose").FlatRecord<Analytics>> & import("mongoose").FlatRecord<Analytics> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
