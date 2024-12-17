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
  async createCourse(data: {
    title: string;
    description: string;
    category: string;
    difficultyLevel: string;
    courseImage: string;
    courseMaterial: string;
  }): Promise<Course> {
    console.log('aa');
    const newCourse = new this.courseModel(data);
    return newCourse.save();
  }
  async addModule(data: {
    courseId: string;
    title: string;
    content: string;
    resources?: string[];
  }): Promise<Module> {
    const course = await this.courseModel.findById(data.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const newModule = new this.moduleModel(data);
    return newModule.save();
  }
  async updateCourse(
    courseId: string,
    data: Partial<Course>,
    updatedBy: string,
  ): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const version = new this.versionModel({
      courseId,
      updatedBy,
      changeSummary: `Course updated: ${Object.keys(data).join(', ')}`, // Corrected syntax
    });
    await version.save();

    Object.assign(course, data); // Ensure the `course` object is updated
    return course.save();
  }

  async getCourseVersions(courseId: string): Promise<Version[]> {
    return this.versionModel.find({ courseId }).sort({ updatedAt: -1 }).exec();
  }

  async getAllCourses(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  async searchCourses(query: string): Promise<Course[]> {
    return this.courseModel
      .find({ title: { $regex: query, $options: 'i' } })
      .exec();
  }
}
