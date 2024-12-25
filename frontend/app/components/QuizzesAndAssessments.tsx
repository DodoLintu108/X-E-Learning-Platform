"use client";

import { useState, useEffect } from "react";
import axios, {AxiosError } from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
};

export function QuizzesAndAssessments({ courseId }: { courseId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `http://localhost:3000/courses/${courseId}/quiz`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.questions) {
          setQuestions(response.data.questions);
        } else {
          console.error('No quiz available for this course.');
          setQuestions([]);
        }
      } catch (error) {
        // Cast error as AxiosError
        const err = error as AxiosError;
    
        if (err.response) {
          console.error('Error fetching quiz:', err.response.data);
        } else {
          console.error('Error fetching quiz:', err.message);
        }
        setQuestions([]);
      }
    };
    fetchQuiz();
  }, [courseId]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
  };

  if (loading) {
    return <p>Loading quiz...</p>;
  }

  if (!questions.length) {
    return <p>No quiz available for this course.</p>;
  }

  return (
    <div>
      <Navbar />
      <Card>
        <CardHeader>
          <CardTitle>Course Quiz</CardTitle>
          <CardDescription>Answer the questions to test your knowledge</CardDescription>
        </CardHeader>
        <CardContent>
          {!quizCompleted ? (
            <>
              <h3 className="text-lg font-semibold mb-4">
                Question {currentQuestion + 1} of {questions.length}
              </h3>
              <p className="mb-4">{questions[currentQuestion].text}</p>
              <div className="flex flex-col space-y-2">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    variant={selectedAnswer === index ? "default" : "outline"}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Quiz Completed!</h3>
              <p className="text-xl">
                Your score: {score} out of {questions.length}
              </p>
              <Button onClick={resetQuiz}>Restart Quiz</Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {!quizCompleted && selectedAnswer !== null && (
            <Button
            onClick={() => handleAnswer(selectedAnswer!)}
            variant="default"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
