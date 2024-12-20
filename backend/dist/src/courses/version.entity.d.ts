import { Document } from 'mongoose';
export type VersionDocument = Version & Document;
export declare class Version {
    courseId: string;
    updatedBy: string;
    changeSummary: string;
    updatedAt: Date;
}
export declare const VersionSchema: import("mongoose").Schema<Version, import("mongoose").Model<Version, any, any, any, Document<unknown, any, Version> & Version & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Version, Document<unknown, {}, import("mongoose").FlatRecord<Version>> & import("mongoose").FlatRecord<Version> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
