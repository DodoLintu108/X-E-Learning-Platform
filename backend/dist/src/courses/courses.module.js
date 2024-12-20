"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const courses_controller_1 = require("./courses.controller");
const courses_service_1 = require("./courses.service");
const courses_entity_1 = require("./courses.entity");
const modules_entity_1 = require("./modules.entity");
const version_entity_1 = require("./version.entity");
const jwt_1 = require("@nestjs/jwt");
const auth_guard_1 = require("../auth/auth.guard");
let CoursesModule = class CoursesModule {
};
exports.CoursesModule = CoursesModule;
exports.CoursesModule = CoursesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({}),
            mongoose_1.MongooseModule.forFeature([
                { name: courses_entity_1.Course.name, schema: courses_entity_1.CourseSchema },
                { name: modules_entity_1.Module.name, schema: modules_entity_1.ModuleSchema },
                { name: version_entity_1.Version.name, schema: version_entity_1.VersionSchema },
            ]),
        ],
        controllers: [courses_controller_1.CoursesController],
        providers: [courses_service_1.CoursesService, auth_guard_1.AuthGuard],
        exports: [courses_service_1.CoursesService],
    })
], CoursesModule);
//# sourceMappingURL=courses.module.js.map