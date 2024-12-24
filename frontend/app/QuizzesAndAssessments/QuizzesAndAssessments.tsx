'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Question = {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

const questions: Question[] = [
  {
    id: 1,
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
  },
  {
    id: 2,
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
  },
  {
    id: 3,
    text: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
    correctAnswer: 1,
  },
]

export function QuizzesAndAssessments() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleAnswer = () => {
    if (selectedAnswer !== null) {
      if (selectedAnswer === questions[currentQuestion].correctAnswer) {
        setScore(score + 1)
      }
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setQuizCompleted(true)
      }
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setQuizCompleted(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adaptive Quiz</CardTitle>
        <CardDescription>Test your knowledge with our adaptive quiz system</CardDescription>
      </CardHeader>
      <CardContent>
        {!quizCompleted ? (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Question {currentQuestion + 1} of {questions.length}
            </h3>
            <p className="mb-4">{questions[currentQuestion].text}</p>
            <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Quiz Completed!</h3>
            <p className="text-xl">
              Your score: {score} out of {questions.length}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {!quizCompleted ? (
          <Button onClick={handleAnswer} disabled={selectedAnswer === null}>
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        ) : (
          <Button onClick={resetQuiz}>Restart Quiz</Button>
        )}
      </CardFooter>
    </Card>
  )
}

