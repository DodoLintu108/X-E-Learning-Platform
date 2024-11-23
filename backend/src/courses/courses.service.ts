// Course-related business logic (Tasks 2.1, 2.2, 2.3)

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './courses.entity';
import { Module, ModuleDocument } from './modules.entity';
import { Version, VersionDocument } from './version.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel(Version.name) private versionModel: Model<VersionDocument>,
  ) {}

  /**
   * Creates a new course.
   */
  async createCourse(data: {
    title: string;
    description: string;
    category: string;
    difficultyLevel: string;
    createdBy: string;
  }): Promise<Course> {
    const newCourse = new this.courseModel(data);
    return newCourse.save();
  }

  /**
   * Adds a new module to an existing course.
   */
  async addModule(data: {
    courseId: string;
    title: string;
    content: string;
    resources?: string[];
  }): Promise<Module> {
    const course = await this.courseModel.findById(data.courseId); // Use courseId as _id
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const newModule = new this.moduleModel(data);
    return newModule.save();
  }

  /**
   * Updates a course and tracks version history.
   */
  async updateCourse(
    courseId: string,
    data: Partial<Course>,
    updatedBy: string,
  ): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Save version history
    const version = new this.versionModel({
      courseId,
      updatedBy,
      changeSummary: Course updated: ${Object.keys(data).join(', ')},
    });
    await version.save();

    // Update the course
    Object.assign(course, data);
    return course.save();
  }

  /**
   * Fetches version history of a course.
   */
  async getCourseVersions(courseId: string): Promise<Version[]> {
    return this.versionModel.find({ courseId }).sort({ updatedAt: -1 }).exec();
  }

  /**
   * Searches for courses by title.
   */
  async searchCourses(query: string): Promise<Course[]> {
    return this.courseModel
      .find({ title: { $regex: query, $options: 'i' } })
      .exec();
  }
}