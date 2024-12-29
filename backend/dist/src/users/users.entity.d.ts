import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    userId: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    learningPreference?: string;
    subjectsOfInterest?: string[];
    createdAt: Date;
    failedLoginAttempts: number;
    unauthorizedAccessLogs: Array<{
        date: Date;
        ipAddress: string;
    }>;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Log extends Document {
    userId: string;
    action: string;
    createdAt: Date;
}
export declare const LogSchema: import("mongoose").Schema<Log, import("mongoose").Model<Log, any, any, any, Document<unknown, any, Log> & Log & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Log, Document<unknown, {}, import("mongoose").FlatRecord<Log>> & import("mongoose").FlatRecord<Log> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
