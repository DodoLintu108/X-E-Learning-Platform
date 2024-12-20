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
exports.AnalyticsSchema = exports.Analytics = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Analytics = class Analytics {
};
exports.Analytics = Analytics;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Analytics.prototype, "analyticsId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Analytics.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Analytics.prototype, "completionPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Analytics.prototype, "averageScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Analytics.prototype, "engagementModules", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number] }),
    __metadata("design:type", Array)
], Analytics.prototype, "engagementTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Map, of: Number }),
    __metadata("design:type", Map)
], Analytics.prototype, "assessmentResults", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                quizId: String,
                difficulty: String,
                averageScore: Number,
            },
        ],
    }),
    __metadata("design:type", Array)
], Analytics.prototype, "contentEffectiveness", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Analytics.prototype, "reportUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Analytics.prototype, "createdAt", void 0);
exports.Analytics = Analytics = __decorate([
    (0, mongoose_1.Schema)()
], Analytics);
exports.AnalyticsSchema = mongoose_1.SchemaFactory.createForClass(Analytics);
//# sourceMappingURL=analytics.schema.js.map