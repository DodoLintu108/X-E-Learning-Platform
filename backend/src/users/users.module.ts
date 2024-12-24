import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller'; // Import UsersController
import { Log, LogSchema, User, UserSchema } from './users.entity'; // Import User schema and entity
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard'; // Import RolesGuard for role-based access
import { CoursesModule } from '../courses/courses.module'; // Import CoursesModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Log.name, schema: LogSchema },]), // Add Mongoose schema
    CoursesModule, // Add CoursesModule to access CoursesService
  ],
  providers: [
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Register RolesGuard globally
    },
  ],
  controllers: [UsersController], // Add UsersController
  exports: [UsersService], // Export UsersService for use in other modules
})
export class UsersModule {}
