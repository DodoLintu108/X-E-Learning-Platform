import { Document, Schema as MongooseSchema } from 'mongoose';
export declare class Quiz extends Document {
    title: string;
    courseId: string;
    questions: Array<{
        question: string;
        options: string[];
        correctAnswer: string;
    }>;
    attempts: number;
}
export declare const QuizSchema: MongooseSchema<Quiz, import("mongoose").Model<Quiz, any, any, any, Document<unknown, any, Quiz> & Quiz & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Quiz, Document<unknown, {}, import("mongoose").FlatRecord<Quiz>> & import("mongoose").FlatRecord<Quiz> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
