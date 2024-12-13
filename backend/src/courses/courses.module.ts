import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course, CourseSchema } from './courses.entity';
import { Module as ModuleEntity, ModuleSchema } from './modules.entity';
import { Version, VersionSchema } from './version.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: ModuleEntity.name, schema: ModuleSchema },
      { name: Version.name, schema: VersionSchema }, // Add Version schema here
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
