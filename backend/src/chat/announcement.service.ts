import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement, AnnouncementDocument } from './announcement.entity';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectModel(Announcement.name) private announcementModel: Model<AnnouncementDocument>,
  ) {}

  async createAnnouncement(courseId: string, title: string, content: string) {
    const announcement = new this.announcementModel({ courseId, title, content });
    return announcement.save();
  }

  async getCourseAnnouncements(courseId: string) {
    return this.announcementModel.find({ courseId }).sort({ createdAt: -1 }).exec();
  }

  
}
