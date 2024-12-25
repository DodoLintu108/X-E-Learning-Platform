import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./QuizzesAndAssessments.css"; // Import your CSS file

interface Quiz {
  quizId: string; // Updated to match your backend structure
  title: string;
  level: string; // Assuming level exists in your schema
  questions: Array<{
    question: string;
    options: string[];
  }>;
}

interface QuizzesAndAssessmentsProps {}

export const QuizzesAndAssessments: React.FC<QuizzesAndAssessmentsProps> = () => {
  const params = useParams();
  const courseId = Array.isArray(params?.courseId) ? params.courseId[0] : params.courseId;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch quizzes for the course
  useEffect(() => {
    if (!courseId) {
      console.error("Course ID is missing");
      return;
    }
  
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userID"); // Retrieve userId from localStorage
  
        if (!token) {
          throw new Error("No access token found");
        }
  
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }
  
        const response = await fetch(`http://localhost:3000/courses/${courseId}/quizzes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }
  
        const data = await response.json();
  
        // Filter out quizzes that have been submitted by the user
        const availableQuizzes = data.filter((quiz: any) => {
          return !quiz.submittedBy?.some((submission: any) => submission.userId === userId);
        });
  
        setQuizzes(availableQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuizzes();
  }, [courseId]);
  

  // Handle answer change
  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  // Handle quiz submission
  const handleSubmit = async () => {
    if (!selectedQuiz) return;
  
    if (Object.keys(answers).length !== selectedQuiz.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
  
    try {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userID"); // Retrieve userId from localStorage
  
      if (!token) {
        throw new Error("No access token found");
      }
  
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }
  
      const response = await fetch(
        `http://localhost:3000/courses/${courseId}/quizzes/${selectedQuiz.quizId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId, // Use the retrieved userId
            answers: Object.entries(answers).map(([questionId, answer]) => ({
              questionId,
              answer,
            })),
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }
  
      const data = await response.json();
      setScore(data.score);
    } catch (error: any) {
      console.error("Error submitting quiz:", error.message);
      setError(error.message);
    }
  };
  
  

  if (loading) {
    return <div>Loading quizzes...</div>;
  }

  if (quizzes.length === 0) {
    return <div>No quizzes available for this course.</div>;
  }

  return (
    <div className="quizzes-container">
      <h2 className="quizzes-title">Quizzes</h2>
      {error && <div className="error-message">{error}</div>}
      {score !== null ? (
        <div className="score-container">
          <h3>Your Score: {score}</h3>
        </div>
      ) : selectedQuiz ? (
        <div className="quiz">
          <h3>{selectedQuiz.title}</h3>
          <ul className="quiz-questions">
            {selectedQuiz.questions.map((q, questionIndex) => (
              <li key={questionIndex} className="quiz-question">
                <p>{q.question}</p>
                <ul className="quiz-options">
                  {q.options.map((option, optionIndex) => (
                    <li key={optionIndex}>
                      <label>
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          value={optionIndex}
                          checked={answers[questionIndex] === optionIndex}
                          onChange={() => handleAnswerChange(questionIndex, optionIndex)}
                        />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button className="submit-button" onClick={handleSubmit}>
            Submit Quiz
          </button>
        </div>
      ) : (
        <ul className="quizzes-list">
          {quizzes.map((quiz) => (
            <li key={quiz.quizId} className="quiz-item">
              <div className="quiz-info">
                <h3>{quiz.title}</h3>
                <p>Level: {quiz.level}</p>
                <p>{quiz.questions.length} questions</p>
              </div>
              <button
                className="quiz-button"
                onClick={() => setSelectedQuiz(quiz)}
              >
                Start Quiz
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
