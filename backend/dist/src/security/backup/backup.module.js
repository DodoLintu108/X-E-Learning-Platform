"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupModule = void 0;
const common_1 = require("@nestjs/common");
const backup_service_1 = require("./backup.service");
const backup_controller_1 = require("./backup.controller");
const mongoose_1 = require("@nestjs/mongoose");
const courses_entity_1 = require("../../courses/courses.entity");
const users_entity_1 = require("../../users/users.entity");
const schedule_1 = require("@nestjs/schedule");
let BackupModule = class BackupModule {
};
exports.BackupModule = BackupModule;
exports.BackupModule = BackupModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            mongoose_1.MongooseModule.forFeature([
                { name: courses_entity_1.Course.name, schema: courses_entity_1.CourseSchema },
                { name: users_entity_1.User.name, schema: users_entity_1.UserSchema },
            ]),
        ],
        controllers: [backup_controller_1.BackupController],
        providers: [backup_service_1.BackupService],
    })
], BackupModule);
//# sourceMappingURL=backup.module.js.map