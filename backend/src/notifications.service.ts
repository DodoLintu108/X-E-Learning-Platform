import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  async getNotifications(recipientId: string): Promise<Notification[]> {
    return this.notificationModel.find({ recipientId }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  }
}
