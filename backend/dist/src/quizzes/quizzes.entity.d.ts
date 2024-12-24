import { Document } from 'mongoose';
export type QuizDocument = Quiz & Document;
export declare class Quiz {
    quizId: string;
    courseId: string;
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
    }[];
    createdAt: Date;
}
export declare const QuizSchema: import("mongoose").Schema<Quiz, import("mongoose").Model<Quiz, any, any, any, Document<unknown, any, Quiz> & Quiz & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Quiz, Document<unknown, {}, import("mongoose").FlatRecord<Quiz>> & import("mongoose").FlatRecord<Quiz> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
