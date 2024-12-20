import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//import { NotificationsModule } from './notifications/notifications.module';
//import { QuizzesModule } from './quizzes/quizzes.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://abdelrhmanmersal:merso2003@main.y2sz6.mongodb.net/?retryWrites=true&w=majority'), // Update with your MongoDB URL
    //NotificationsModule,
    //QuizzesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
