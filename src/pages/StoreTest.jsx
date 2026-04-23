import { useState, useEffect } from 'react'
import { saveWeight, getAllWeights, getAllWeightsForAllUsers, saveWorkout, getAllWorkoutsForAllUsers, USERS, WORKOUT_PARTS } from '../store'

/**
 * 第2步验证组件：测试 IndexedDB 读写
 */
function StoreTest() {
  const [log, setLog] = useState([])

  const addLog = (msg) => setLog((prev) => [...prev, msg])

  // 测试写入体重数据
  async function testWeight() {
    const today = new Date().toISOString().slice(0, 10)
    for (const user of USERS) {
      const w = (60 + Math.random() * 20).toFixed(1)
      await saveWeight(user.id, today, parseFloat(w), '测试数据')
      addLog(`✓ 写入体重: ${user.name} ${today} ${w}kg`)
    }
    // 写入过去3天数据
    for (let i = 1; i <= 3; i++) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
      for (const user of USERS) {
        const w = (60 + Math.random() * 20).toFixed(1)
        await saveWeight(user.id, d, parseFloat(w), '')
      }
    }
    addLog('✓ 写入过去3天体重数据')
  }

  // 测试写入训练数据
  async function testWorkout() {
    const today = new Date().toISOString().slice(0, 10)
    for (let i = 0; i < USERS.length; i++) {
      await saveWorkout(USERS[i].id, today, WORKOUT_PARTS[i % WORKOUT_PARTS.length], '测试训练')
      addLog(`✓ 写入训练: ${USERS[i].name} 今日练${WORKOUT_PARTS[i % WORKOUT_PARTS.length]}`)
    }
  }

  // 测试读取
  async function testRead() {
    for (const user of USERS) {
      const weights = await getAllWeights(user.id)
      addLog(`✓ 读取 ${user.name} 体重记录: ${weights.length} 条`)
    }
    const allWeights = await getAllWeightsForAllUsers()
    addLog(`✓ 读取全部体重记录: ${allWeights.length} 条`)
    const allWorkouts = await getAllWorkoutsForAllUsers()
    addLog(`✓ 读取全部训练记录: ${allWorkouts.length} 条`)
  }

  // 测试覆盖更新
  async function testOverwrite() {
    const today = new Date().toISOString().slice(0, 10)
    await saveWeight('user_me', today, 99.9, '覆盖测试')
    const record = await getAllWeights('user_me')
    const todayRecord = record.find((r) => r.date === today)
    addLog(`✓ 覆盖写入验证: ${todayRecord.weight}kg (应为 99.9)`)
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">第2步：存储层验证</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={testWeight} className="bg-emerald-500 text-white px-3 py-1.5 rounded text-sm">写入体重</button>
        <button onClick={testWorkout} className="bg-violet-500 text-white px-3 py-1.5 rounded text-sm">写入训练</button>
        <button onClick={testRead} className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm">读取数据</button>
        <button onClick={testOverwrite} className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm">覆盖测试</button>
      </div>

      <div className="bg-gray-100 rounded p-3 text-left text-xs font-mono space-y-1 max-h-96 overflow-y-auto">
        {log.map((l, i) => (
          <div key={i} className="text-gray-700">{l}</div>
        ))}
        {log.length === 0 && <div className="text-gray-400">点击上方按钮测试存储层...</div>}
      </div>
    </div>
  )
}

export default StoreTest
