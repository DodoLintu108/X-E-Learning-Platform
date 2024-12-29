import { Model } from 'mongoose';
import { Announcement, AnnouncementDocument } from './announcement.entity';
export declare class AnnouncementService {
    private announcementModel;
    constructor(announcementModel: Model<AnnouncementDocument>);
    createAnnouncement(courseId: string, title: string, content: string): Promise<import("mongoose").Document<unknown, {}, AnnouncementDocument> & Announcement & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getCourseAnnouncements(courseId: string): Promise<(import("mongoose").Document<unknown, {}, AnnouncementDocument> & Announcement & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
