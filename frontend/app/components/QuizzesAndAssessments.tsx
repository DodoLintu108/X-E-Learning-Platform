import React, { useEffect, useState } from "react";
import "./QuizzesAndAssessments.css"; // Import your CSS file

interface Quiz {
  id: string;
  title: string;
  lecture: string; // Add a lecture field to link quizzes to their lecture
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

interface QuizzesAndAssessmentsProps {
  courseId: string;
}

export const QuizzesAndAssessments: React.FC<QuizzesAndAssessmentsProps> = ({
  courseId,
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await fetch(
          `http://localhost:3000/courses/${courseId}/quizzes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized - Check your token");
          }
          throw new Error("Failed to fetch quizzes");
        }

        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [courseId]);

  if (loading) {
    return <div>Loading quizzes...</div>;
  }

  if (quizzes.length === 0) {
    return <div>No quizzes available for this course.</div>;
  }

  return (
    <div className="quizzes-container">
      <h2 className="quizzes-title">Quizzes</h2>
      <ul className="quizzes-list">
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="quiz-item">
            <div className="quiz-info">
              <h3>{quiz.title}</h3>
              <p>Lecture: {quiz.lecture}</p>
              <p>{quiz.questions.length} questions</p>
            </div>
            <button
              className="quiz-button"
              onClick={() => alert(`Entering quiz: ${quiz.title}`)}
            >
              Start Quiz
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
