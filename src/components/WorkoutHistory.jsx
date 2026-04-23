import { useMemo } from 'react'
import { USERS } from '../store'

/**
 * 训练历史记录列表
 */
export default function WorkoutHistory({ allWorkouts }) {
  const records = useMemo(() => {
    if (!allWorkouts.length) return []
    return allWorkouts.slice(0, 14) // 最近14条
  }, [allWorkouts])

  if (!records.length) return null

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">最近打卡</h3>

      <div className="space-y-2">
        {records.map((r) => {
          const user = USERS.find((u) => u.id === r.userId)
          return (
            <div key={`${r.userId}-${r.date}`} className="flex items-center gap-3 text-sm">
              <span className="text-gray-400 text-xs w-14 flex-shrink-0">{r.date.slice(5)}</span>
              <span className="text-lg flex-shrink-0">{user?.avatar}</span>
              <span className="flex-1 font-medium text-gray-700">{user?.name}</span>
              <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-lg text-xs font-medium">
                {r.part}
              </span>
              {r.note && (
                <span className="text-gray-400 text-xs w-16 truncate">{r.note}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
