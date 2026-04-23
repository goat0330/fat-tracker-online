import { useState, useEffect } from 'react'
import { saveWorkout, getWorkout, USERS, WORKOUT_PARTS } from '../store'
import DatePicker from './DatePicker'
import WheelPicker from './WheelPicker'

/**
 * 训练打卡表单
 */
export default function WorkoutInput({ onSaved }) {
  const today = new Date().toISOString().slice(0, 10)
  const [selectedUser, setSelectedUser] = useState(USERS[0].id)
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedPart, setSelectedPart] = useState(WORKOUT_PARTS[0])
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)

  // 切换日期或用户时加载已有记录
  useEffect(() => {
    setNote('')
    setSaved(false)
    setSelectedPart(WORKOUT_PARTS[0])
    getWorkout(selectedUser, selectedDate).then((record) => {
      if (record) {
        setSelectedPart(record.part)
        setNote(record.note || '')
      }
    })
  }, [selectedUser, selectedDate])

  const handleSave = async () => {
    await saveWorkout(selectedUser, selectedDate, selectedPart, note)
    setSaved(true)
    onSaved?.()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">训练打卡</h3>

      {/* 用户切换 */}
      <div className="flex gap-2 mb-4">
        {USERS.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedUser(u.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              selectedUser === u.id
                ? 'bg-violet-500 text-white shadow'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {u.avatar} {u.name}
          </button>
        ))}
      </div>

      {/* 日期选择 */}
      <div className="mb-4">
        <DatePicker value={selectedDate} onChange={setSelectedDate} />
      </div>

      {/* 滚轮选择器 */}
      <div className="mb-2 text-center">
        <p className="text-xs text-gray-400 mb-2">滑动选择训练部位</p>
        <WheelPicker value={selectedPart} onChange={setSelectedPart} />
      </div>

      {/* 选中提示 */}
      <div className="text-center mb-4">
        <span className="inline-block px-4 py-1.5 bg-violet-50 text-violet-600 rounded-full text-sm font-medium">
          今日训练：{selectedPart}
        </span>
      </div>

      {/* 备注 */}
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="备注（可选）"
        className="w-full px-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 mb-4 transition-all"
      />

      {/* 保存按钮 */}
      <button
        onClick={handleSave}
        className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
          saved
            ? 'bg-violet-100 text-violet-700'
            : 'bg-violet-500 text-white shadow active:scale-95'
        }`}
      >
        {saved ? '✓ 已保存' : '打卡完成'}
      </button>
    </div>
  )
}
