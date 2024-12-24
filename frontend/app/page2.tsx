'use client'

import { useState } from 'react'
import { Notifications } from '@/components/Notifications'
import { QuizzesAndAssessments } from '@/components/QuizzesAndAssessments'
import { RealTimeFeedback } from '@/components/RealTimeFeedback'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [activeSlide, setActiveSlide] = useState<'notifications' | 'quizzes' | 'feedback'>('notifications')

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">E-Learning Platform Features</h1>
      <div className="flex space-x-4 mb-6">
        <Button onClick={() => setActiveSlide('notifications')}>Notifications</Button>
        <Button onClick={() => setActiveSlide('quizzes')}>Quizzes & Assessments</Button>
        <Button onClick={() => setActiveSlide('feedback')}>Real-Time Feedback</Button>
      </div>
      <div className="border rounded-lg p-6 bg-white shadow-lg">
        {activeSlide === 'notifications' && <Notifications />}
        {activeSlide === 'quizzes' && <QuizzesAndAssessments />}
        {activeSlide === 'feedback' && <RealTimeFeedback />}
      </div>
    </div>
  )
}

