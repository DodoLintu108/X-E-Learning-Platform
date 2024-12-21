import { Document } from 'mongoose';
export type ModuleDocument = Module & Document;
export declare class Version {
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
export declare class Module {
    moduleId: string;
    courseId: string;
    courseImage: string;
    courseMaterial: string;
    title: string;
    content: string;
    resources: string[];
    createdAt: Date;
    versionHistory: Version[];
}
export declare const ModuleSchema: import("mongoose").Schema<Module, import("mongoose").Model<Module, any, any, any, Document<unknown, any, Module> & Module & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Module, Document<unknown, {}, import("mongoose").FlatRecord<Module>> & import("mongoose").FlatRecord<Module> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
