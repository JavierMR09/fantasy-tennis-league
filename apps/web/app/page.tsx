'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { fetcher } from '../lib/fetcher'
import ProtectedRoute from '../components/ProtectedRoute'
import { useUser } from '../context/UserContext'
import LeagueCard from '../components/LeagueCard'

export default function Home() {
  const { user } = useUser()

  const { data, isLoading } = useSWR<{ leagues: any[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/league`,
    fetcher
  )

  return (
    <ProtectedRoute>
      <h1 className="text-2xl mb-4">Welcome, {user?.name ?? user?.email}</h1>

      {isLoading && <p>Loading your leagues…</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {data?.leagues.map(lg => (
          <LeagueCard key={lg.id} league={lg} />
        ))}
      </div>

      <Link
        href="/leagues/new (TODO)"
        className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Create League
      </Link>
    </ProtectedRoute>
  )
}
