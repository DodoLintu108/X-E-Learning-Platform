import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from './notifications/notifications.module';
import { QuizzesModule } from './quizzes/quizzes.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/elearning'), // Update with your MongoDB URL
    NotificationsModule,
    QuizzesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
