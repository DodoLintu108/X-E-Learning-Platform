'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

type FeedbackType = 'positive' | 'negative' | 'neutral'

export function RealTimeFeedback() {
  const [feedback, setFeedback] = useState('')
  const [submittedFeedback, setSubmittedFeedback] = useState<{ type: FeedbackType; message: string } | null>(null)

  const handleSubmit = () => {
    let type: FeedbackType = 'neutral'
    let message = "Thank you for your feedback. We'll review it shortly."

    if (feedback.toLowerCase().includes('great') || feedback.toLowerCase().includes('excellent')) {
      type = 'positive'
      message = "We're glad you had a positive experience! Thank you for your feedback."
    } else if (feedback.toLowerCase().includes('poor') || feedback.toLowerCase().includes('bad')) {
      type = 'negative'
      message = "We're sorry to hear about your experience. We'll work on improving."
    }

    setSubmittedFeedback({ type, message })
    setFeedback('')
  }

  const getFeedbackIcon = (type: FeedbackType) => {
    switch (type) {
      case 'positive':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />
      case 'negative':
        return <XCircle className="h-6 w-6 text-red-500" />
      case 'neutral':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Feedback</CardTitle>
        <CardDescription>Share your thoughts and get instant responses</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Type your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
        />
        {submittedFeedback && (
          <div className="mt-4 flex items-start space-x-2 p-3 bg-gray-100 rounded-md">
            {getFeedbackIcon(submittedFeedback.type)}
            <p>{submittedFeedback.message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!feedback.trim()}>
          Submit Feedback
        </Button>
      </CardFooter>
    </Card>
  )
}

