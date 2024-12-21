// Course-related business logic (Tasks 2.1, 2.2, 2.3)

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
    rating: number;
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
  async updateCourse(courseId: string, data: Partial<Course>): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // const version = new this.versionModel({
    //   courseId,
    //   changeSummary: `Course updated: ${Object.keys(data).join(', ')}`, // Corrected syntax
    // });
    // await version.save();

    Object.assign(course, data); // Ensure the `course` object is updated
    return course.save();
  }

  async getCourseVersions(courseId: string): Promise<Version[]> {
    return this.versionModel.find({ courseId }).sort({ updatedAt: -1 }).exec();
  }

  async getAllCourses(): Promise<Course[]> {
    const courses = await this.courseModel.find().exec();
    const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}`; // Add your domain
    return courses.map((course) => {
      if (course.courseImage) {
        course.courseImage = `${baseUrl}/uploads/${course.courseImage}`;
      }
      if (course.courseMaterial) {
        course.courseMaterial = `${baseUrl}/uploads/${course.courseMaterial}`;
      }
      return course;
    });
  }

  async getCourseById(courseId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}`; // Add your domain
    if (course.courseImage) {
      course.courseImage = `${baseUrl}/uploads/${course.courseImage}`;
    }
    if (course.courseMaterial) {
      course.courseMaterial = `${baseUrl}/uploads/${course.courseMaterial}`;
    }
    return course;
  }

  async getCourseByCategory(category: string): Promise<Course[]> {
    const courses = await this.courseModel.find({ category }).exec();
    if (!courses || courses.length === 0) {
      throw new NotFoundException('Course not found');
    }
    const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}`; // Add your domain
    return courses.map((course) => {
      if (course.courseImage) {
        course.courseImage = `${baseUrl}/uploads/${course.courseImage}`;
      }
      if (course.courseMaterial) {
        course.courseMaterial = `${baseUrl}/uploads/${course.courseMaterial}`;
      }
      return course;
    });
  }

  async searchCourses(query: string): Promise<Course[]> {
    const courses = await this.courseModel
      .find({ title: { $regex: query, $options: 'i' } })
      .exec();

    if (!courses || courses.length === 0) {
      throw new NotFoundException('Course not found');
    }

    const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}`;

    return courses.map((course) => ({
      ...course.toObject(),
      courseImage: course.courseImage
        ? `${baseUrl}/uploads/${course.courseImage}`
        : null,
      courseMaterial: course.courseMaterial
        ? `${baseUrl}/uploads/${course.courseMaterial}`
        : null,
    }));
  }

  async enrollStudent(courseId: string, studentId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
  
    if (!course.enrolledStudents.includes(studentId)) {
      course.enrolledStudents.push(studentId);
      return course.save();
    }
  
    throw new ForbiddenException('Student already enrolled');
  }
  
  async deleteCourse(courseId: string): Promise<boolean> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.moduleModel.deleteMany({ courseId });
    await this.versionModel.deleteMany({ courseId });

    await this.courseModel.findByIdAndDelete(courseId);

    return true;
  }
}
