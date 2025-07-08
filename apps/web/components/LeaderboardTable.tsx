export default function LeaderboardTable({ rows }: { rows: any[] }) {
  return (
    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Team</th>
          <th className="p-2 text-right">Points</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.id} className="border-t">
            <td className="p-2">{i + 1}. {r.name ?? r.teamName}</td>
            <td className="p-2 text-right">{r.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
