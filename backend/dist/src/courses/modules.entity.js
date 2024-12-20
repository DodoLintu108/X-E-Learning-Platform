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
exports.ModuleSchema = exports.Module = exports.VersionSchema = exports.Version = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const uuid_1 = require("uuid");
let Version = class Version {
};
exports.Version = Version;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Version.prototype, "updatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Version.prototype, "changeSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Version.prototype, "updatedAt", void 0);
exports.Version = Version = __decorate([
    (0, mongoose_1.Schema)()
], Version);
exports.VersionSchema = mongoose_1.SchemaFactory.createForClass(Version);
let Module = class Module {
};
exports.Module = Module;
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: uuid_1.v4 }),
    __metadata("design:type", String)
], Module.prototype, "moduleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Module.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Module.prototype, "courseImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Module.prototype, "courseMaterial", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Module.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Module.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Module.prototype, "resources", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Module.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.VersionSchema] }),
    __metadata("design:type", Array)
], Module.prototype, "versionHistory", void 0);
exports.Module = Module = __decorate([
    (0, mongoose_1.Schema)()
], Module);
exports.ModuleSchema = mongoose_1.SchemaFactory.createForClass(Module);
//# sourceMappingURL=modules.entity.js.map