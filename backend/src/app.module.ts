import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AnalyticsModule } from './analytics/analytics.module'; // If AnalyticsModule is still needed
import { CoursesModule } from './courses/courses.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BackupModule } from './security/backup/backup.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://abdelrhmanmersal:merso2003@main.y2sz6.mongodb.net/main?retryWrites=true&w=majority',
    ),
    BackupModule,
    AuthModule,
    MulterModule.register({
      dest: '../uploads',
    }),
    UsersModule,
    AnalyticsModule, // Include this if analytics is part of your app
    CoursesModule,
    FilesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'), // Move up two levels from 'dist'
      serveRoot: '/uploads',
    }),
  ],
})
export class AppModule {}
