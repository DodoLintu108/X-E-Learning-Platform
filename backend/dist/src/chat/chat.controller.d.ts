import { ChatService } from './chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    sendMessage(chatRoomId: string, body: {
        senderId: string;
        content: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./message.entity").MessageDocument> & import("./message.entity").Message & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getMessages(chatRoomId: string): Promise<(import("mongoose").Document<unknown, {}, import("./message.entity").MessageDocument> & import("./message.entity").Message & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    initiateChat(body: {
        studentId: string;
        courseId: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./message.entity").MessageDocument> & import("./message.entity").Message & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
