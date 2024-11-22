import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AnalyticsModule } from './analytics/analytics.module'; // If AnalyticsModule is still needed

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://abdelrhmanmersal:merso2003@main.y2sz6.mongodb.net/main?retryWrites=true&w=majority'
    ),
    AuthModule,
    UsersModule,
    AnalyticsModule, // Include this if analytics is part of your app
  ],
})
export class AppModule {}