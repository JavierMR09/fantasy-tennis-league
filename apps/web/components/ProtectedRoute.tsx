'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    // once loading is done, if no user, kick to /login
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [isLoading, user, router])

  // don’t flash protected content while loading or unauthenticated
  if (isLoading || !user) {
    return null
  }

  return <>{children}</>
}
