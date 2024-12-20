declare class QuestionDto {
    question: string;
    options: string[];
    correctAnswer: string;
}
export declare class CreateQuizDto {
    title: string;
    courseId: string;
    questions: QuestionDto[];
}
export {};
