import { Document } from 'mongoose';
export type ResponseDocument = Response & Document;
export declare class Response {
    responseId: string;
    userId: string;
    quizId: string;
    answers: {
        questionId: string;
        answer: number;
    }[];
    score: number;
    submittedAt: Date;
}
export declare const ResponseSchema: import("mongoose").Schema<Response, import("mongoose").Model<Response, any, any, any, Document<unknown, any, Response> & Response & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Response, Document<unknown, {}, import("mongoose").FlatRecord<Response>> & import("mongoose").FlatRecord<Response> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
