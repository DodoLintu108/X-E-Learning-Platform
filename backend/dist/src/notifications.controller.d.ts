import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<import("./notification.schema").Notification>;
    getNotifications(recipientId: string): Promise<import("./notification.schema").Notification[]>;
    markAsRead(id: string): Promise<import("./notification.schema").Notification>;
}
