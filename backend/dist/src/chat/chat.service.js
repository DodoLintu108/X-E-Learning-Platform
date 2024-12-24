"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_entity_1 = require("./message.entity");
let ChatService = class ChatService {
    constructor(messageModel) {
        this.messageModel = messageModel;
    }
    async sendMessage(chatRoomId, senderId, content) {
        const message = new this.messageModel({ chatRoomId, senderId, content });
        return message.save();
    }
    async getMessages(chatRoomId) {
        return this.messageModel.find({ chatRoomId }).sort({ sentAt: 1 }).exec();
    }
    async createOrFetchChatRoom(studentId, courseId) {
        const existingRoom = await this.messageModel.findOne({
            participants: { $all: [studentId, courseId] },
        });
        if (existingRoom) {
            return existingRoom;
        }
        const newRoom = new this.messageModel({
            courseId,
            participants: [studentId, courseId],
        });
        return newRoom.save();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_entity_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map