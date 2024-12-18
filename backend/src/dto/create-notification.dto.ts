import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsEnum(['student', 'instructor', 'admin'])
  recipientRole: string;

  @IsNotEmpty()
  @IsString()
  recipientId: string;
}
