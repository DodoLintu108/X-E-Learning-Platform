import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationsService {
    private notificationModel;
    constructor(notificationModel: Model<Notification>);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    getNotifications(recipientId: string): Promise<Notification[]>;
    markAsRead(notificationId: string): Promise<Notification>;
}
