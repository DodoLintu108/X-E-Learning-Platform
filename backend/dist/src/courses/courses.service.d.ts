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
        courseImage: string;
        courseMaterial: string;
    }): Promise<Course>;
    addModule(data: {
        courseId: string;
        title: string;
        content: string;
        resources?: string[];
    }): Promise<Module>;
    updateCourse(courseId: string, data: Partial<Course>, updatedBy: string): Promise<Course>;
    getCourseVersions(courseId: string): Promise<Version[]>;
    getAllCourses(): Promise<Course[]>;
    searchCourses(query: string): Promise<Course[]>;
    enrollStudent(courseId: string, studentId: string): Promise<Course>;
    deleteCourse(courseId: string): Promise<boolean>;
    getCoursesByRole(role: string): Promise<Course[]>;
}
