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
  }): Promise<Course> {
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
    updatedBy?: string, // Optional to maintain compatibility
  ): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // If `updatedBy` is provided, create a version entry
    if (updatedBy) {
      const version = new this.versionModel({
        courseId,
        updatedBy,
        changeSummary: `Course updated: ${Object.keys(data).join(', ')}`,
      });
      await version.save();
    }

    // Update course details
    Object.assign(course, data);
    return course.save();
  }

  // Get courses assigned to a student
  async getAssignedCourses(studentId: string): Promise<Course[]> {
    return this.courseModel.find({ enrolledStudents: studentId }).exec();
  }

  // Get courses available to a student (not yet enrolled)
  async getAvailableCourses(studentId: string): Promise<Course[]> {
    return this.courseModel.find({ enrolledStudents: { $ne: studentId } }).exec();
  }

  // Get courses taught by a teacher
  async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    return this.courseModel.find({ createdBy: teacherId }).exec();
  }


  async getCourseVersions(courseId: string): Promise<Version[]> {
    return this.versionModel.find({ courseId }).sort({ updatedAt: -1 }).exec();
  }

  async getAllCourses(): Promise<Course[]> {
    const courses = await this.courseModel.find().exec();
    const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}`;
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
    const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}`;
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
    const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}`;
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

  async getCoursesByRole(role: string): Promise<Course[]> {
    const roleCriteria: Record<string, any> = {};
    if (role === 'student') roleCriteria.forStudents = true;
    else if (role === 'teacher') roleCriteria.forTeachers = true;
    else if (role === 'admin') roleCriteria.forAdmins = true;
    else throw new NotFoundException('Invalid role');
  
    const courses = await this.courseModel.find(roleCriteria).exec();
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

async addLectureToCourse(
  courseId: string,
  lectureData: { title: string; type: 'video' | 'pdf'; content: string },
): Promise<Course> {
  const course = await this.courseModel.findById(courseId); // Assuming you're using Mongoose
  if (!course) {
    throw new NotFoundException('Course not found');
  }

  // Add lecture data to the course
  course.lectures.push({
    title: lectureData.title,
    type: lectureData.type,
    content: lectureData.content,
    createdAt: new Date(), // Add the current timestamp
  });
  
  await course.save();
  return course;
}

async addLecture(courseId: string, lectureData: { title: string; type: 'video' | 'pdf'; content: string }) {
  const course = await this.courseModel.findById(courseId);

  if (!course) {
    throw new NotFoundException('Course not found');
  }

  const lecture = {
    title: lectureData.title,
    type: lectureData.type,
    content: lectureData.content,
    createdAt: new Date(),
  };

  course.lectures.push(lecture);
  await course.save();

  return course;
}

}
