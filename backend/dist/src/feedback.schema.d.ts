import { Document } from 'mongoose';
export declare class Feedback extends Document {
    userId: string;
    message: string;
    quizId: string;
    resolved: boolean;
}
export declare const FeedbackSchema: import("mongoose").Schema<Feedback, import("mongoose").Model<Feedback, any, any, any, Document<unknown, any, Feedback> & Feedback & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Feedback, Document<unknown, {}, import("mongoose").FlatRecord<Feedback>> & import("mongoose").FlatRecord<Feedback> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
