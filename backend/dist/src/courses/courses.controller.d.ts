import { CoursesService } from './courses.service';
import { Course } from './courses.entity';
import { Module } from './modules.entity';
import { Version } from './version.entity';
import { CreateCourseDto } from './create-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(req: any, createCourseDto: CreateCourseDto, files: {
        files?: Express.Multer.File[];
        imagefiles?: Express.Multer.File[];
    }): Promise<{
        message: string;
        course: Course;
    }>;
    updateCourse(courseId: string, updateCourseDto: Partial<Course>, files: {
        files?: Express.Multer.File[];
        imagefiles?: Express.Multer.File[];
    }): Promise<any>;
    getStudentCourses(req: any): Promise<{
        assigned: Course[];
        available: Course[];
    }>;
    getTeacherCourses(req: any): Promise<Course[]>;
    addModule(courseId: string, body: {
        title: string;
        content: string;
        resources?: string[];
    }): Promise<Module>;
    searchCourses(query: string): Promise<Course[]>;
    getAllCourses(): Promise<Course[]>;
    getCourseById(courseId: string): Promise<Course>;
    getCourses(roleOrId: string): Promise<Course | Course[]>;
    getCourseByCategory(category: string): Promise<Course[]>;
    getCourseVersions(courseId: string): Promise<Version[]>;
    deleteCourse(courseId: string): Promise<{
        message: string;
    }>;
    getCoursesByRole(role: string): Promise<Course[]>;
    addFiles(courseId: string, files: {
        files?: Express.Multer.File[];
        imagefiles?: Express.Multer.File[];
    }): Promise<{
        message: string;
        course: Course;
    }>;
    addQuizToCourse(courseId: string, quizData: {
        level: string;
        questions: {
            question: string;
            options: string[];
            correctAnswer: number;
        }[];
    }): Promise<any>;
    addQuiz(courseId: string, quizData: {
        level: string;
        questions: Array<{
            question: string;
            options: string[];
            correctAnswer: number;
        }>;
    }): Promise<{
        message: string;
        quiz: any;
    }>;
    getQuizzes(courseId: string): Promise<any[]>;
    getQuiz(courseId: string, quizId: string): Promise<any>;
    deleteQuiz(courseId: string, quizId: string): Promise<{
        message: string;
        course: Course;
    }>;
    addLecture(courseId: string, lectureData: {
        title: string;
        type: 'video' | 'pdf';
        content: string;
    }): Promise<{
        message: string;
        course: Course;
    }>;
    enrollInCourse(courseId: string, req: any): Promise<{
        message: string;
        course: Course;
    }>;
    getCourseDetails(courseId: string): Promise<any>;
    getQuizzesForCourse(courseId: string): Promise<any[]>;
}
