import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret:
        '094d1e090c8615a7b453162c425f14b34ed070f968cac5fbaaecb0fd26f11e5747cb65d1a84bf925d0c0163ba63949b1023342bd52b56883c9f8d5df5fa65278',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
