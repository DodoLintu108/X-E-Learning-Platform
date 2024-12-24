import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.entity';
export declare class ChatService {
    private messageModel;
    constructor(messageModel: Model<MessageDocument>);
    sendMessage(chatRoomId: string, senderId: string, content: string): Promise<import("mongoose").Document<unknown, {}, MessageDocument> & Message & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getMessages(chatRoomId: string): Promise<(import("mongoose").Document<unknown, {}, MessageDocument> & Message & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    createOrFetchChatRoom(studentId: string, courseId: string): Promise<import("mongoose").Document<unknown, {}, MessageDocument> & Message & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
