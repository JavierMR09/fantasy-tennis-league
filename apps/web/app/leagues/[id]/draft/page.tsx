'use client'

import useSWR, { mutate as globalMutate } from 'swr'
import { useParams } from 'next/navigation'
import { fetcher } from '../../../../lib/fetcher'
import ProtectedRoute from '../../../../components/ProtectedRoute'
import PlayerTable from '../../../../components/PlayerTable'

type LeagueDraftDTO = {
  id: string
  name: string
  ownerId: string
  currentUserId: string
  draftOrder: string[]
  currentPick: number
  draftStarted: boolean
  takenPlayerIds: string[]
}



export default function DraftPage() {
  const { id } = useParams<{ id: string }>()

  const { data: league, mutate: mutateLeague } = useSWR<LeagueDraftDTO>(
    `${process.env.NEXT_PUBLIC_API_URL}/league/${id}`,
    fetcher,
    { refreshInterval: 5000 } // poll for current pick
  )

  type Player = {id: string; name: string; nationality?: string;}
  const { data: players } = useSWR<{ players: Player[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/players`,
    fetcher
  )
  

  async function startDraft() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/league/${id}/draft/start`, {
      method: 'POST',
      credentials: 'include',
    })
    mutateLeague()
  }

  async function pick(playerId: string) {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/league/${id}/draft/pick`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ playerId }),
      }
    )
    globalMutate(
      `${process.env.NEXT_PUBLIC_API_URL}/players`
    ) // refetch player list for taken flag
    mutateLeague()
  }

  if (!league) return null

  const isOwner = league.ownerId === league.currentUserId
  const yourTurn =
    league.draftOrder?.[league.currentPick] === league.currentUserId

  return (
    <ProtectedRoute>
      <h1 className="text-2xl mb-4">Draft – {league.name}</h1>

      {!league.draftStarted && isOwner && (
        <button
          onClick={startDraft}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start Draft
        </button>
      )}

      {league.draftStarted && (
        <>
          <p className="mb-2">
            Pick #{league.currentPick + 1} –{' '}
            {yourTurn ? 'Your turn!' : 'Waiting for others…'}
          </p>

          <PlayerTable
            players={players?.players ?? []}
            onPick={yourTurn ? pick : undefined}
            draftedIds={league.takenPlayerIds ?? []}
          />
        </>
      )}
    </ProtectedRoute>
  )
}
