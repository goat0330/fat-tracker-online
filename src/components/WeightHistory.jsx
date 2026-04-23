import { useMemo } from 'react'
import { USERS } from '../store'

const COLORS = ['text-emerald-600 bg-emerald-50', 'text-violet-600 bg-violet-50']

/**
 * 体重历史记录列表
 */
export default function WeightHistory({ allWeights }) {
  const grouped = useMemo(() => {
    if (!allWeights.length) return []
    // 按日期分组，显示两人对比
    const map = new Map()
    allWeights.forEach((r) => {
      if (!map.has(r.date)) map.set(r.date, {})
      map.get(r.date)[r.userId] = r
    })
    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 14) // 最近14天
  }, [allWeights])

  if (!grouped.length) return null

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">最近记录</h3>

      <div className="space-y-2">
        {grouped.map(([date, records]) => (
          <div key={date} className="flex items-center gap-3 text-sm">
            <span className="text-gray-400 text-xs w-14 flex-shrink-0">{date.slice(5)}</span>
            {USERS.map((u, i) => {
              const r = records[u.id]
              if (!r) {
                return (
                  <div key={u.id} className="flex-1 text-center text-gray-300 text-xs">
                    -
                  </div>
                )
              }
              const prevRecords = Object.values(records).filter(
                (v) => v && v.userId !== u.id
              )
              return (
                <div
                  key={u.id}
                  className={`flex-1 flex items-center gap-1 justify-center px-2 py-1.5 rounded-lg ${COLORS[i]}`}
                >
                  <span className="text-xs">{u.avatar}</span>
                  <span className="font-semibold">{r.weight}</span>
                  <span className="text-xs opacity-60">kg</span>
                </div>
              )
            })}
            {records[USERS[0].id]?.note || records[USERS[1].id]?.note ? (
              <span className="text-gray-400 text-xs w-16 truncate">
                {records[USERS[0].id]?.note || records[USERS[1].id]?.note}
              </span>
            ) : (
              <span className="w-16" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
