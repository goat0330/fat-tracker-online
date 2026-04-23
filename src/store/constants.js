// 双人用户信息
const USERS = [
  { id: 'user_me', name: '我', avatar: '🧑' },
  { id: 'user_gf', name: '女朋友', avatar: '👩' },
]

// 固定训练部位（不可增删）
const WORKOUT_PARTS = ['胸', '背', '臀腿', '手臂', '肩']

// IndexedDB 数据库配置
const DB_NAME = 'fatTrackerDB'
const DB_VERSION = 1

const STORES = {
  WEIGHTS: 'weights',      // 体重记录
  WORKOUTS: 'workouts',    // 训练打卡
}

export { USERS, WORKOUT_PARTS, DB_NAME, DB_VERSION, STORES }
