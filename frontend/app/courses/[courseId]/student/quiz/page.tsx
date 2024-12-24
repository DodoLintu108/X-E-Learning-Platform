"use client";

import { useParams } from "next/navigation"; // Import useParams
import { QuizzesAndAssessments } from "../../../../components/QuizzesAndAssessments";

const QuizPage = () => {
  const params = useParams(); // Use params to get all route parameters
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId; // Ensure courseId is a string

  if (!courseId) {
    return <div>Loading...</div>; // Handle case where courseId is not available yet
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quizzes and Assessments</h1>
      {/* Pass courseId as a prop to QuizzesAndAssessments */}
      <QuizzesAndAssessments courseId={courseId} />
    </div>
  );
};

export default QuizPage;
