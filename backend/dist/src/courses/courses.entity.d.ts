import { Document } from 'mongoose';
export type CourseDocument = Course & Document;
export declare class Quiz {
    quizId: string;
    moduleId: string;
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
    title: string;
    type: 'video' | 'pdf';
    quizzes: Quiz[];
    content: string;
    createdAt: Date;
}
export declare const LectureSchema: import("mongoose").Schema<Lecture, import("mongoose").Model<Lecture, any, any, any, Document<unknown, any, Lecture> & Lecture & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Lecture, Document<unknown, {}, import("mongoose").FlatRecord<Lecture>> & import("mongoose").FlatRecord<Lecture> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
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
export declare const CourseSchema: import("mongoose").Schema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course> & Course & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>> & import("mongoose").FlatRecord<Course> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
