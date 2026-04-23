import { useMemo } from 'react'

/**
 * 日期选择器 - 仅开放当日 + 过去7天
 */
export default function DatePicker({ value, onChange }) {
  const dates = useMemo(() => {
    const list = []
    for (let i = 0; i <= 7; i++) {
      const d = new Date(Date.now() - i * 86400000)
      const label = i === 0 ? '今天' : i === 1 ? '昨天' : `${d.getMonth() + 1}/${d.getDate()}`
      list.push({
        value: d.toISOString().slice(0, 10),
        label,
      })
    }
    return list
  }, [])

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {dates.map((d) => (
        <button
          key={d.value}
          onClick={() => onChange(d.value)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            value === d.value
              ? 'bg-emerald-500 text-white shadow'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          {d.label}
        </button>
      ))}
    </div>
  )
}
