import { CoursesService } from './courses.service';
import { Course } from './courses.entity';
import { Module } from './modules.entity';
import { Version } from './version.entity';
import { CreateCourseDto } from './create-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(createCourseDto: CreateCourseDto, files: {
        files?: Express.Multer.File[];
        imagefiles?: Express.Multer.File[];
    }): Promise<{
        message: string;
        course: Course;
        files: {
            material: string;
            image: string;
        };
    }>;
    addModule(courseId: string, body: {
        title: string;
        content: string;
        resources?: string[];
    }): Promise<Module>;
    searchCourses(query: string): Promise<Course[]>;
    getAllCourses(): Promise<Course[]>;
    getCourseById(courseId: string): Promise<Course>;
    getCourseByCategory(category: string): Promise<Course[]>;
    updateCourse(courseId: string, body: Partial<Course>): Promise<Course>;
    getCourseVersions(courseId: string): Promise<Version[]>;
    deleteCourse(courseId: string): Promise<{
        message: string;
    }>;
    getCoursesByRole(role: string): Promise<Course[]>;
}
