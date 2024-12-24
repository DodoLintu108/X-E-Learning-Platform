import { Document } from 'mongoose';
export declare class Announcement {
    courseId: string;
    title: string;
    content: string;
    createdAt: Date;
}
export type AnnouncementDocument = Announcement & Document;
export declare const AnnouncementSchema: import("mongoose").Schema<Announcement, import("mongoose").Model<Announcement, any, any, any, Document<unknown, any, Announcement> & Announcement & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Announcement, Document<unknown, {}, import("mongoose").FlatRecord<Announcement>> & import("mongoose").FlatRecord<Announcement> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
