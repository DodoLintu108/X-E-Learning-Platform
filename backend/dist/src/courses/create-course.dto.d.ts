export declare enum DifficultyLevel {
    Easy = "Easy",
    Intermediate = "Intermediate",
    Hard = "Hard"
}
export declare class CreateCourseDto {
    title: string;
    description: string;
    category: string;
    difficultyLevel: DifficultyLevel;
    courseMaterial: Express.Multer.File;
    courseImage: Express.Multer.File;
}
