'use client'

import { UserButton, useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { userId } = useAuth()

  return (
    <main className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Next.js Starter</h1>
        {userId && <UserButton />}
      </div>

      <div className="space-y-4">
        <p className="text-lg text-muted-foreground">
          Добро пожаловать в современный Next.js стартер!
        </p>
        <Button>Начать работу</Button>
      </div>
    </main>
  )
}
