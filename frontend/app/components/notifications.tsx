'use client'

import { useState } from 'react'
import { Bell, MessageCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'



type Notification = {
  id: number
  type: 'message' | 'announcement' | 'alert'
  content: string
  timestamp: string
}

const initialNotifications: Notification[] = [
  { id: 1, type: 'message', content: 'New message from Instructor', timestamp: '2 minutes ago' },
  { id: 2, type: 'announcement', content: 'Course material updated', timestamp: '1 hour ago' },
  { id: 3, type: 'alert', content: 'Quiz due tomorrow', timestamp: '3 hours ago' },
]

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const clearNotifications = () => {
    setNotifications([])
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5" />
      case 'announcement':
        return <Bell className="h-5 w-5" />
      case 'alert':
        return <AlertCircle className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Stay updated with your latest course activities</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li key={notification.id} className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{notification.content}</p>
                  <p className="text-sm text-gray-500">{notification.timestamp}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No new notifications</p>
        )}
        <Button onClick={clearNotifications} className="mt-4 w-full">
          Clear All Notifications
        </Button>
      </CardContent>
    </Card>
  )
}

