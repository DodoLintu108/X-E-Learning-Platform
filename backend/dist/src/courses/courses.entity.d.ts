import { Document } from 'mongoose';
export declare class Quiz {
    quizId: string;
    title: string;
    level: string;
    questions: Array<{
        question: string;
        options: string[];
        correctAnswer: number;
    }>;
    submittedBy: Array<{
        userId: string;
        score: number;
        submittedAt: Date;
    }>;
    createdAt: Date;
}
declare class Lecture {
    title: string;
    type: 'video' | 'pdf';
    content: string;
    quizzes: Quiz[];
    createdAt: Date;
}
export declare class Course {
    courseId: string;
    title: string;
    description: string;
    category: string;
    difficultyLevel: string;
    createdBy: string;
    enrolledStudents: string[];
    courseImage: string;
    courseMaterial: string;
    createdAt: Date;
    lectures: Lecture[];
}
export interface Course {
    title: string;
    description: string;
    category: string;
    difficultyLevel: string;
    isEnded: boolean;
}
export type CourseDocument = Course & Document;
export declare const CourseSchema: import("mongoose").Schema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course> & Course & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>> & import("mongoose").FlatRecord<Course> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export {};
