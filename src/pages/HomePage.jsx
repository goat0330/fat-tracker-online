import { useState, useEffect, useCallback } from 'react'
import { USERS, getAllWeightsForAllUsers, getAllWorkoutsForAllUsers } from '../store'
import avatarMe from '../assets/avatar_me.jpg'
import avatarGf from '../assets/avatar_gf.jpg'

const AVATARS = { user_me: avatarMe, user_gf: avatarGf }
const COLORS = ['border-emerald-400', 'border-violet-400']
const TAG_COLORS = ['bg-emerald-50 text-emerald-600', 'bg-violet-50 text-violet-600']

/**
 * 单个用户打卡状态卡片
 */
function UserCard({ user, weight, workout, avatarSrc }) {
  const today = new Date().toISOString().slice(0, 10)
  const idx = USERS.indexOf(user)
  const hasWeight = weight?.date === today
  const hasWorkout = workout?.date === today

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border-t-4 ${COLORS[idx]}`}>
      {/* 头像 + 名字 */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow mb-2">
          <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
        </div>
        <span className="font-bold text-gray-800">{user.name}</span>
      </div>

      {/* 今日状态 */}
      <div className="space-y-3">
        {/* 体重打卡 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">今日体重</span>
          {hasWeight ? (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${TAG_COLORS[idx]}`}>
              {weight.weight} kg
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-400">未打卡</span>
          )}
        </div>

        {/* 训练打卡 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">今日训练</span>
          {hasWorkout ? (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${TAG_COLORS[idx]}`}>
              {workout.part} ✓
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-400">未打卡</span>
          )}
        </div>

        {/* 最近体重（非今日） */}
        {!hasWeight && weight && (
          <div className="text-xs text-gray-400 text-center">
            最近体重：{weight.weight} kg（{weight.date.slice(5)}）
          </div>
        )}

        {/* 最近训练（非今日） */}
        {!hasWorkout && workout && (
          <div className="text-xs text-gray-400 text-center">
            最近训练：{workout.part}（{workout.date.slice(5)}）
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 双人监督首页
 */
export default function HomePage() {
  const today = new Date().toISOString().slice(0, 10)
  const [weights, setWeights] = useState([])
  const [workouts, setWorkouts] = useState([])

  const loadData = useCallback(async () => {
    const [w, wo] = await Promise.all([getAllWeightsForAllUsers(), getAllWorkoutsForAllUsers()])
    setWeights(w)
    setWorkouts(wo)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // 获取每人今日数据
  const todayWeight = (userId) => weights.find((r) => r.userId === userId && r.date === today)
  const todayWorkout = (userId) => workouts.find((r) => r.userId === userId && r.date === today)
  // 获取每人最近数据（无论日期）
  const latestWeight = (userId) => {
    const userWeights = weights.filter((r) => r.userId === userId).sort((a, b) => b.date.localeCompare(a.date))
    return userWeights[0]
  }
  const latestWorkout = (userId) => {
    const userWorkouts = workouts.filter((r) => r.userId === userId).sort((a, b) => b.date.localeCompare(a.date))
    return userWorkouts[0]
  }

  // 今日完成度
  const meChecked = (todayWeight('user_me') ? 1 : 0) + (todayWorkout('user_me') ? 1 : 0)
  const gfChecked = (todayWeight('user_gf') ? 1 : 0) + (todayWorkout('user_gf') ? 1 : 0)

  return (
    <div className="p-4 pb-24">
      {/* 标题 */}
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold text-gray-800">减脂打卡</h1>
        <p className="text-xs text-gray-400 mt-1">{today}</p>
      </div>

      {/* 今日完成度 */}
      {(meChecked > 0 || gfChecked > 0) && (
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            meChecked >= gfChecked && meChecked > 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'
          }`}>
            <img src={avatarMe} alt="驰" className="w-6 h-6 rounded-full object-cover" />
            <span className="text-sm text-gray-600">
              {meChecked === 2 ? '全部完成 ✓' : meChecked === 1 ? '完成 1/2' : '未打卡'}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            gfChecked >= meChecked && gfChecked > 0 ? 'bg-violet-50 border border-violet-200' : 'bg-gray-50'
          }`}>
            <img src={avatarGf} alt="蔓" className="w-6 h-6 rounded-full object-cover" />
            <span className="text-sm text-gray-600">
              {gfChecked === 2 ? '全部完成 ✓' : gfChecked === 1 ? '完成 1/2' : '未打卡'}
            </span>
          </div>
        </div>
      )}

      {/* 双人卡片 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {USERS.map((user, i) => (
          <UserCard
            key={user.id}
            user={user}
            weight={todayWeight(user.id) || latestWeight(user.id)}
            workout={todayWorkout(user.id) || latestWorkout(user.id)}
            avatarSrc={AVATARS[user.id]}
          />
        ))}
      </div>

      {/* 空数据提示 */}
      {weights.length === 0 && workouts.length === 0 && (
        <div className="text-center py-12 text-gray-300">
          <p className="text-4xl mb-3">🌱</p>
          <p className="text-sm">还没有打卡记录</p>
          <p className="text-xs mt-1">点击下方按钮开始记录吧</p>
        </div>
      )}
    </div>
  )
}
