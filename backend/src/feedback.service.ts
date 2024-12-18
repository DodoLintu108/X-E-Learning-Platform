import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from './feedback.schema';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel(Feedback.name) private feedbackModel: Model<Feedback>) {}

  async createFeedback(data: { userId: string; message: string; quizId: string }): Promise<Feedback> {
    const feedback = new this.feedbackModel(data);
    return feedback.save();
  }

  async resolveFeedback(feedbackId: string): Promise<Feedback> {
    return this.feedbackModel.findByIdAndUpdate(feedbackId, { resolved: true }, { new: true });
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return this.feedbackModel.find().exec();
  }
}
