import { AnnouncementService } from './announcement.service';
export declare class AnnouncementController {
    private announcementService;
    constructor(announcementService: AnnouncementService);
    createAnnouncement(body: {
        courseId: string;
        title: string;
        content: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./announcement.entity").AnnouncementDocument> & import("./announcement.entity").Announcement & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getCourseAnnouncements(courseId: string): Promise<(import("mongoose").Document<unknown, {}, import("./announcement.entity").AnnouncementDocument> & import("./announcement.entity").Announcement & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
