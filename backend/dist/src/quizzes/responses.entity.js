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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseSchema = exports.Response = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const uuid_1 = require("uuid");
let Response = class Response {
};
exports.Response = Response;
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: uuid_1.v4 }),
    __metadata("design:type", String)
], Response.prototype, "responseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Response.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Response.prototype, "quizId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                questionId: { type: String, required: true },
                answer: { type: Number, required: true },
            },
        ],
        required: true,
    }),
    __metadata("design:type", Array)
], Response.prototype, "answers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Response.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Response.prototype, "submittedAt", void 0);
exports.Response = Response = __decorate([
    (0, mongoose_1.Schema)()
], Response);
exports.ResponseSchema = mongoose_1.SchemaFactory.createForClass(Response);
//# sourceMappingURL=responses.entity.js.map