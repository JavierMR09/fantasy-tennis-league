export default function PlayerTable({
  players,
  onPick,
  draftedIds,
}: {
  players: any[]
  onPick?: (id: string) => void
  draftedIds: string[]
}) {
  return (
    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Name</th>
          <th className="p-2">Nationality</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {players.map(p => (
          <tr key={p.id} className="border-t">
            <td className="p-2">{p.name}</td>
            <td className="p-2 text-center">{p.nationality}</td>
            <td className="p-2 text-right">
              {draftedIds.includes(p.id) ? (
                <span className="text-gray-400">Drafted</span>
              ) : onPick ? (
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded"
                  onClick={() => onPick(p.id)}
                >
                  Pick
                </button>
              ) : (
                ''
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
