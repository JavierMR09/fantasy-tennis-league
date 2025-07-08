'use client'

import useSWR from 'swr'
import { useParams, useRouter } from 'next/navigation'
import { fetcher } from '../../../lib/fetcher'
import ProtectedRoute from '../../../components/ProtectedRoute'
import Link from 'next/link'
import { useState } from 'react'

export default function LeagueDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data, mutate } = useSWR<{ league: any }>(
    `${process.env.NEXT_PUBLIC_API_URL}/league/${id}`,
    fetcher
  )
  const [joining, setJoining] = useState(false)

  async function join() {
    setJoining(true)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/league/${id}/join`, {
      method: 'POST',
      credentials: 'include',
    })
    mutate() // refresh
    setJoining(false)
  }

  if (!data) return null

  const lg = data.league
  const joined = lg.members?.some((m: any) => m.userId === lg.currentUserId)

  return (
    <ProtectedRoute>
      <h1 className="text-2xl">{lg.name}</h1>

      {!joined && (
        <button
          disabled={joining}
          onClick={join}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          Join League
        </button>
      )}

      <div className="flex space-x-4">
        <Link href={`/leagues/${id}/draft`} className="link">
          Draft
        </Link>
        <Link href={`/leagues/${id}/roster`} className="link">
          My Team
        </Link>
        <Link href={`/leagues/${id}/standings`} className="link">
          Standings
        </Link>
      </div>
    </ProtectedRoute>
  )
}
