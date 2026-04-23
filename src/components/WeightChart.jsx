import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { USERS } from '../store'

const COLORS = ['#10b981', '#8b5cf6'] // 我=绿，女朋友=紫

function WeightChart({ allWeights }) {
  // 将数据转换为 Recharts 需要的格式
  const chartData = useMemo(() => {
    if (!allWeights.length) return []

    // 收集所有有记录的日期
    const dateMap = new Map()
    allWeights.forEach((r) => {
      if (!dateMap.has(r.date)) dateMap.set(r.date, { date: r.date })
      dateMap.get(r.date)[r.userId] = r.weight
    })

    return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date))
  }, [allWeights])

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-gray-400 text-sm">暂无体重数据</p>
        <p className="text-gray-300 text-xs mt-1">记录体重后将在此显示趋势曲线</p>
      </div>
    )
  }

  // 计算体重范围
  const weights = allWeights.map((r) => r.weight)
  const minW = Math.floor(Math.min(...weights) - 1)
  const maxW = Math.ceil(Math.max(...weights) + 1)

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">体重趋势</h3>

      {/* 图例 */}
      <div className="flex gap-4 mb-3 justify-center">
        {USERS.map((u, i) => (
          <div key={u.id} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-3 h-0.5 rounded" style={{ backgroundColor: COLORS[i] }} />
            {u.avatar} {u.name}
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickFormatter={(d) => d.slice(5)}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minW, maxW]}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            width={35}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              fontSize: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            formatter={(value) => [`${value} kg`, '体重']}
            labelFormatter={(d) => d}
          />
          {USERS.map((u, i) => (
            <Line
              key={u.id}
              type="monotone"
              dataKey={u.id}
              stroke={COLORS[i]}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 0, fill: COLORS[i] }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WeightChart
