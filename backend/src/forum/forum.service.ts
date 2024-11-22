import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum, ForumDocument } from './forum.schema';

@Injectable()
export class ForumService {
  constructor(@InjectModel(Forum.name) private forumModel: Model<ForumDocument>) {}

  /**
   * Create a new thread in a forum.
   * @param courseId - The ID of the course
   * @param title - The title of the thread
   * @param authorId - The ID of the user creating the thread
   */
  async createThread(courseId: string, title: string, authorId: string) {
    return this.forumModel.findOneAndUpdate(
      { courseId }, // Find the forum by courseId
      {
        $push: {
          threads: {
            threadId: `${Date.now()}`, // Generate a unique thread ID
            title,
            authorId,
            replies: [],
            createdAt: new Date(),
          },
        },
      },
      { new: true, upsert: true }, // Create the forum if it doesn't exist
    );
  }

  /**
   * Add a reply to an existing thread.
   * @param courseId - The ID of the course
   * @param threadId - The ID of the thread
   * @param content - The content of the reply
   * @param authorId - The ID of the user writing the reply
   */
  async addReply(courseId: string, threadId: string, content: string, authorId: string) {
    return this.forumModel.findOneAndUpdate(
      { courseId, 'threads.threadId': threadId }, // Match the forum and thread
      {
        $push: {
          'threads.$.replies': {
            replyId: `${Date.now()}`, // Generate a unique reply ID
            content,
            authorId,
            timestamp: new Date(),
          },
        },
      },
      { new: true },
    );
  }

  /**
   * Search threads in a course forum by title.
   * @param courseId - The ID of the course
   * @param query - The search query
   */
  async searchThreads(courseId: string, query: string) {
    return this.forumModel.findOne({
      courseId,
      'threads.title': { $regex: query, $options: 'i' }, // Case-insensitive search
    });
  }
}
