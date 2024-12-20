declare class ResponseDto {
    question: string;
    selectedAnswer: string;
}
export declare class SubmitQuizDto {
    studentId: string;
    quizId: string;
    responses: ResponseDto[];
}
export {};
