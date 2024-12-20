import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './users.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { CoursesModule } from '../courses/courses.module'; // Import CoursesModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CoursesModule, // Import CoursesModule for access to CoursesService
  ],
  providers: [
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Register the RolesGuard globally
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
