import { Injectable, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Course, CourseDocument } from './courses.entity';
import { Module, ModuleDocument } from './modules.entity';
import { Version, VersionDocument } from './version.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel(Version.name) private versionModel: Model<VersionDocument>,
  ) { }

  async createCourse(data: {
    title: string;
    description: string;
    category: string;
    difficultyLevel: string;
    courseImage?: string;
    courseMaterial?: string;
    isEnded?: boolean; // Make it optional
  }): Promise<Course> {
    const newCourse = new this.courseModel({
      ...data,
      isEnded: data.isEnded ?? false, // Default to false if not provided
    });
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

  async addQuizToCourse(
    courseId: string,
    quizData: {
      title: string;
      level: string;
      questions: Array<{ question: string; options: string[]; correctAnswer: number }>;
    },
  ): Promise<any> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const newQuiz = {
      quizId: new Date().toISOString(),
      title: quizData.title || 'Untitled Quiz', // Default title if missing
      level: quizData.level,
      questions: quizData.questions,
      submittedBy: [],
      createdAt: new Date(),
    };

    const targetLecture = course.lectures[course.lectures.length - 1];
    if (!targetLecture) {
      throw new NotFoundException('No lectures found in the course to add the quiz.');
    }

    targetLecture.quizzes.push(newQuiz);

    await course.save();
    return newQuiz;
  }

  async getCourseDetailsForStudent(courseId: string, studentId: string,): Promise<any> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Calculate average score for the student
    const quizzes = course.lectures.flatMap((lecture) => lecture.quizzes || []);
    const submissions = quizzes.flatMap((quiz) =>
      quiz.submittedBy.filter((submission) => submission.userId === studentId)
    );

    const totalScore = submissions.reduce((sum, sub) => sum + sub.score, 0);
    const averageScore = submissions.length ? totalScore / submissions.length : 0;


    return {

      title: course.title,
      description: course.description,
      category: course.category,
      difficultyLevel: course.difficultyLevel,
      teacherName: course.createdBy, // Adjust if populated with user info
      lectures: course.lectures, // Assuming lectures exist on the course schema
      createdAt: course.createdAt,
      isEnded: course.isEnded,
      averageScore: averageScore.toFixed(2), // Include the average score
    };
  }


  async endCourse(id: string): Promise<Course> {
    return this.courseModel.findByIdAndUpdate(id, { isEnded: true }, { new: true }).exec();
  }


  async submitQuizResponse(
    courseId: string,
    quizId: string,
    userId: string,
    answers: Array<{ questionId: string; answer: number }>
  ): Promise<{ score: number }> {
    try {
      const course = await this.courseModel.findById(courseId);
      if (!course) {
        throw new NotFoundException('Course not found');
      }
  
      const quiz = course.lectures
        .flatMap((lecture) => lecture.quizzes || [])
        .find((quiz) => quiz.quizId === quizId);
  
      if (!quiz) {
        throw new NotFoundException('Quiz not found');
      }
  
      // Calculate total number of questions
      const totalQuestions = quiz.questions.length;
  
      // Validate answers and calculate score as a percentage
      const correctAnswers = quiz.questions.map((q) => q.correctAnswer);
      const correctCount = answers.reduce((total, answer, index) => {
        const isCorrect = answer.answer === correctAnswers[index];
        return total + (isCorrect ? 1 : 0);
      }, 0);
  
      const score = ((correctCount / totalQuestions) * 100).toFixed(2);
  
      // Ensure proper update of the submission
      const existingSubmission = quiz.submittedBy.find(
        (submission) => submission.userId === userId
      );
  
      if (existingSubmission) {
        // Update existing submission
        existingSubmission.score = Number(score);
        existingSubmission.submittedAt = new Date();
      } else {
        // Add new submission
        quiz.submittedBy.push({
          userId,
          score: Number(score),
          submittedAt: new Date(),
        });
      }
  
      // Save the updated course document
      const result = await this.courseModel.updateOne(
        { _id: courseId, 'lectures.quizzes.quizId': quizId },
        { $set: { 'lectures.$[l].quizzes.$[q].submittedBy': quiz.submittedBy } },
        {
          arrayFilters: [
            { 'l.quizzes.quizId': quizId },
            { 'q.quizId': quizId },
          ],
        }
      );
  
      if (result.modifiedCount === 0) {
        console.log('Failed to update quiz submission:', result);
        throw new Error('Failed to update quiz submission.');
      }
  
      return { score: Number(score) };
    } catch (error) {
      console.error('Error during quiz submission:', error.message);
      throw new HttpException(
        `Quiz submission failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  

  


  // Get all quizzes for a course
  async getQuizzesByCourse(courseId: string): Promise<any[]> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Collect quizzes from all lectures
    const quizzes = course.lectures.flatMap((lecture) => lecture.quizzes || []);
    return quizzes;
  }

  // Get a specific quiz by its ID
  async getQuizById(courseId: string, quizId: string): Promise<any> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Find the quiz in the lectures
    const quiz = course.lectures
      .flatMap((lecture) => lecture.quizzes || [])
      .find((q) => q.quizId === quizId);

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  // Delete a specific quiz by its ID
  async deleteQuiz(courseId: string, quizId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Find and remove the quiz from lectures
    course.lectures.forEach((lecture) => {
      if (lecture.quizzes) {
        lecture.quizzes = lecture.quizzes.filter((quiz) => quiz.quizId !== quizId);
      }
    });

    await course.save();
    return course;
  }

  // Add a lecture to a course
  async addLecture(
    courseId: string,
    lectureData: { title: string; type: 'video' | 'pdf'; content: string }
  ): Promise<Course> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const lecture = {
      title: lectureData.title,
      type: lectureData.type,
      content: lectureData.content,
      createdAt: new Date(),
      quizzes: [],
    };

    course.lectures.push(lecture);
    await course.save();

    return course;
  }
  async getCourseDetails(courseId: string): Promise<any> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      title: course.title,
      description: course.description,
      category: course.category,
      difficultyLevel: course.difficultyLevel,
      teacherName: course.createdBy, // Adjust if populated with user info
      lectures: course.lectures, // Assuming lectures exist on the course schema
      createdAt: course.createdAt,
      isEnded: { type: Boolean, default: false },
    };
  }

  async getAllQuizzesForCourse(courseId: string): Promise<any[]> {
    // Fetch the course by ID
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Extract quizzes from lectures
    const quizzes = course.lectures.flatMap((lecture) => lecture.quizzes || []);

    return quizzes; // Return all quizzes as a flat array
  }

  async editCourse(courseId: string, updateData: Partial<Course>): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Update the course with new data
    Object.assign(course, updateData);
    return await course.save();
  }

  async deleteCourseById(courseId: string): Promise<void> {
    const result = await this.courseModel.findByIdAndDelete(courseId);
    if (!result) {
      throw new NotFoundException('Course not found');
    }
  }


  async updateQuiz(
    courseId: string,
    lectureId: string,
    quizId: string,
    quizUpdateData: {
      title?: string;
      level?: string;
      questions?: Array<{
        question: string;
        options: string[];
        correctAnswer: number;
      }>;
    },
  ): Promise<Course> {
    // 1) Find the course
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      // throw new NotFoundException('Course not found');
      return null;
    }

    // 2) Find the lecture by _id
    const lecture = course.lectures.find(
      (lec) => lec._id.toString() === lectureId,
    );
    if (!lecture) {
      // throw new NotFoundException('Lecture not found');
      return null;
    }

    // 3) Find the quiz within that lecture
    const quiz = lecture.quizzes.find((q) => q.quizId === quizId);
    if (!quiz) {
      // throw new NotFoundException('Quiz not found');
      return null;
    }

    // 4) Overwrite quiz fields
    if (quizUpdateData.title) quiz.title = quizUpdateData.title;
    if (quizUpdateData.level) quiz.level = quizUpdateData.level;
    if (quizUpdateData.questions) quiz.questions = quizUpdateData.questions;

    // 5) Save the updated course
    await course.save();
    return course;
  }
  async submitFeedback(courseId: string, userId: string, comment: string) {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (!course.isEnded) {
      throw new NotFoundException('Course is still ongoing.');
    }
  
    // Add feedback with all required fields
    course.feedback.push({
      userId,
      comment,
      submittedAt: new Date(), // Include the current date and time
    });
    
    await course.save();
    return { message: 'Feedback submitted successfully' };
  }
  
}

