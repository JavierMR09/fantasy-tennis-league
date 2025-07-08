'use client'
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import { fetcher } from '../../../../lib/fetcher'
import ProtectedRoute from '../../../../components/ProtectedRoute'

export default function RosterPage() {
  const { id } = useParams<{ id: string }>()
  const { data } = useSWR<{ team: any }>(
    `${process.env.NEXT_PUBLIC_API_URL}/team/me?leagueId=${id}`,
    fetcher
  )

  if (!data) return null
  const team = data.team

  return (
    <ProtectedRoute>
      <h1 className="text-2xl mb-4">{team.name} – Roster</h1>
      <ul className="space-y-2">
        {team.players.map((tp: any) => (
          <li key={tp.id} className="border p-2 rounded">
            {tp.player.name}
          </li>
        ))}
      </ul>
    </ProtectedRoute>
  )
}
