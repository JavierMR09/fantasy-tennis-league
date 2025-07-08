'use client'
import useSWR from 'swr'
import { fetcher } from '../../lib/fetcher'
import ProtectedRoute from '../../components/ProtectedRoute'

export default function Calendar() {
  const { data } = useSWR<{ events: any[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/tournaments`,
    fetcher
  )
  if (!data) return null
  return (
    <ProtectedRoute>
      <h1 className="text-2xl mb-4">Upcoming Tournaments</h1>
      <ul className="space-y-2">
        {data.events.map(ev => (
          <li key={ev.id} className="border p-2 rounded">
            <span className="font-medium">{ev.name}</span>
            <span className="ml-2 text-gray-500">
              {new Date(ev.startDate).toLocaleDateString()} –{' '}
              {new Date(ev.endDate).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </ProtectedRoute>
  )
}
