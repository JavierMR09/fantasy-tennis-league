'use client'
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import { fetcher } from '../../../../lib/fetcher'
import ProtectedRoute from '../../../../components/ProtectedRoute'
import LeaderboardTable from '../../../../components/LeaderboardTable'

export default function StandingsPage() {
  const { id } = useParams<{ id: string }>()
  const { data } = useSWR<{ standings: any[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/league/${id}/leaderboard`,
    fetcher,
    { refreshInterval: 10000 }
  )
  if (!data) return null
  return (
    <ProtectedRoute>
      <h1 className="text-2xl mb-4">League Standings</h1>
      <LeaderboardTable rows={data.standings} />
    </ProtectedRoute>
  )
}
