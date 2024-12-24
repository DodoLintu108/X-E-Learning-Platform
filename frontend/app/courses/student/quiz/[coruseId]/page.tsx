import { QuizzesAndAssessments } from "../../../../components/QuizzesAndAssessments";

const QuizPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Quizzes and Assessments</h1>
      <QuizzesAndAssessments courseId={""} />
    </div>
  );
};

export default QuizPage;
