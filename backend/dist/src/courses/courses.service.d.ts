import { Model } from 'mongoose';
import { Course, CourseDocument } from './courses.entity';
import { Module, ModuleDocument } from './modules.entity';
import { Version, VersionDocument } from './version.entity';
export declare class CoursesService {
    private courseModel;
    private moduleModel;
    private versionModel;
    constructor(courseModel: Model<CourseDocument>, moduleModel: Model<ModuleDocument>, versionModel: Model<VersionDocument>);
    createCourse(data: {
        title: string;
        description: string;
        category: string;
        difficultyLevel: string;
        courseImage?: string;
        courseMaterial?: string;
        isEnded?: boolean;
    }): Promise<Course>;
    addModule(data: {
        courseId: string;
        title: string;
        content: string;
        resources?: string[];
    }): Promise<Module>;
    updateCourse(courseId: string, data: Partial<Course>, updatedBy?: string): Promise<Course>;
    getAssignedCourses(studentId: string): Promise<Course[]>;
    getAvailableCourses(studentId: string): Promise<Course[]>;
    getCoursesByTeacher(teacherId: string): Promise<Course[]>;
    getCourseVersions(courseId: string): Promise<Version[]>;
    getAllCourses(): Promise<Course[]>;
    getCourseById(courseId: string): Promise<Course>;
    getCourseByCategory(category: string): Promise<Course[]>;
    searchCourses(query: string): Promise<Course[]>;
    enrollStudent(courseId: string, studentId: string): Promise<Course>;
    deleteCourse(courseId: string): Promise<boolean>;
    getCoursesByRole(role: string): Promise<Course[]>;
    addQuizToCourse(courseId: string, quizData: {
        title: string;
        level: string;
        questions: Array<{
            question: string;
            options: string[];
            correctAnswer: number;
        }>;
    }): Promise<any>;
    getCourseDetailsForStudent(courseId: string, studentId: string): Promise<any>;
    endCourse(id: string): Promise<Course>;
    submitQuizResponse(courseId: string, quizId: string, userId: string, answers: Array<{
        questionId: string;
        answer: number;
    }>): Promise<{
        score: number;
    }>;
    getQuizzesByCourse(courseId: string): Promise<any[]>;
    getQuizById(courseId: string, quizId: string): Promise<any>;
    deleteQuiz(courseId: string, quizId: string): Promise<Course>;
    addLecture(courseId: string, lectureData: {
        title: string;
        type: 'video' | 'pdf';
        content: string;
    }): Promise<Course>;
    getCourseDetails(courseId: string): Promise<any>;
    getAllQuizzesForCourse(courseId: string): Promise<any[]>;
    editCourse(courseId: string, updateData: Partial<Course>): Promise<Course>;
    deleteCourseById(courseId: string): Promise<void>;
    updateQuiz(courseId: string, lectureId: string, quizId: string, quizUpdateData: {
        title?: string;
        level?: string;
        questions?: Array<{
            question: string;
            options: string[];
            correctAnswer: number;
        }>;
    }): Promise<Course>;
    submitFeedback(courseId: string, userId: string, comment: string): Promise<{
        message: string;
    }>;
}
