import { Document, Schema as MongooseSchema } from 'mongoose';

export type QuizDocument = Quiz & Document;

export declare class Quiz {
    quizId: string;
    courseId: string;
    title: string;
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
    }[];
    submittedBy: string[];
    createdAt: Date;
}

export declare class Response {
    userId: string;
    quizId: string;
    answers: {
        questionId: string;
        answer: number;
    }[];
    submittedAt: Date;
}

export declare const QuizSchema: MongooseSchema<Quiz, import("mongoose").Model<Quiz, any, any, any, Document<unknown, any, Quiz> & Quiz & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Quiz, Document<unknown, {}, import("mongoose").FlatRecord<Quiz>> & import("mongoose").FlatRecord<Quiz> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
