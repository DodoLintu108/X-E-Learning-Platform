import { Document, Types } from 'mongoose';
export declare class ChatRoom {
    courseId: string;
    name: string;
    participants: string[];
}
export type ChatRoomDocument = ChatRoom & Document;
export declare const ChatRoomSchema: import("mongoose").Schema<ChatRoom, import("mongoose").Model<ChatRoom, any, any, any, Document<unknown, any, ChatRoom> & ChatRoom & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatRoom, Document<unknown, {}, import("mongoose").FlatRecord<ChatRoom>> & import("mongoose").FlatRecord<ChatRoom> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
