import Link from 'next/link'
export default function LeagueCard({ league }: { league: any }) {
  return (
    <Link
      href={`/leagues/${league.id}`}
      className="block border rounded p-4 hover:bg-gray-50"
    >
      <h2 className="text-xl">{league.name}</h2>
      <p>Owner: {league.ownerId.slice(0, 8)}…</p>
    </Link>
  )
}
