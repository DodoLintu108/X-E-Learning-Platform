import { Document, Types } from 'mongoose';
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
export declare class Lecture {
    _id?: Types.ObjectId;
    title: string;
    type: 'video' | 'pdf';
    content: string;
    createdAt: Date;
    quizzes: Quiz[];
}
export declare class Feedback {
    userId: string;
    comment: string;
    submittedAt: Date;
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
    isEnded: boolean;
    feedback: Feedback[];
}
export type CourseDocument = Course & Document;
export declare const CourseSchema: import("mongoose").Schema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course> & Course & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>> & import("mongoose").FlatRecord<Course> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
