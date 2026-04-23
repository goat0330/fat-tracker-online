import { useState, useEffect } from 'react'
import { saveWeight, getWeight, USERS } from '../store'
import DatePicker from './DatePicker'

/**
 * 体重录入表单
 */
export default function WeightInput({ onSaved }) {
  const today = new Date().toISOString().slice(0, 10)
  const [selectedUser, setSelectedUser] = useState(USERS[0].id)
  const [selectedDate, setSelectedDate] = useState(today)
  const [weight, setWeight] = useState('')
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)

  // 切换日期时加载已有记录
  useEffect(() => {
    setWeight('')
    setNote('')
    setSaved(false)
    getWeight(selectedUser, selectedDate).then((record) => {
      if (record) {
        setWeight(String(record.weight))
        setNote(record.note || '')
      }
    })
  }, [selectedUser, selectedDate])

  const handleSave = async () => {
    const w = parseFloat(weight)
    if (isNaN(w) || w <= 0) return
    await saveWeight(selectedUser, selectedDate, w, note)
    setSaved(true)
    onSaved?.()
    setTimeout(() => setSaved(false), 2000)
  }

  const canSave = weight.trim() !== '' && !isNaN(parseFloat(weight)) && parseFloat(weight) > 0

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">记录体重</h3>

      {/* 用户切换 */}
      <div className="flex gap-2 mb-4">
        {USERS.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedUser(u.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              selectedUser === u.id
                ? 'bg-emerald-500 text-white shadow'
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

      {/* 体重输入 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="number"
            step="0.1"
            min="20"
            max="300"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="输入体重"
            className="w-full text-center text-3xl font-bold text-gray-800 outline-none py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
        </div>
      </div>

      {/* 备注 */}
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="备注（可选，如：水肿、饮食状态）"
        className="w-full px-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 mb-4 transition-all"
      />

      {/* 保存按钮 */}
      <button
        onClick={handleSave}
        disabled={!canSave}
        className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
          saved
            ? 'bg-emerald-100 text-emerald-700'
            : canSave
            ? 'bg-emerald-500 text-white shadow active:scale-95'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {saved ? '✓ 已保存' : '保存'}
      </button>
    </div>
  )
}
