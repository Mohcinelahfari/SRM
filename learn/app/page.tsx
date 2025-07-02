"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold">
            Bienvenue sur le portail RH
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Gérez facilement vos congés et suivez l'état de vos demandes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pt-6">
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
