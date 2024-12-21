import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course, CourseSchema } from './courses.entity';
import { Module as ModuleEntity, ModuleSchema } from './modules.entity';
import { Version, VersionSchema } from './version.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [
    JwtModule.register({}), // Register JWT module for token-related operations
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: ModuleEntity.name, schema: ModuleSchema },
      { name: Version.name, schema: VersionSchema },
    ]),
  ],
  controllers: [CoursesController], // Add Courses Controller
  providers: [CoursesService, AuthGuard], // Add Courses Service and Auth Guard
  exports: [CoursesService], // Export CoursesService to be used in other modules
})
export class CoursesModule {}
