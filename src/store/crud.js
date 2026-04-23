import { getDB } from './db'
import { STORES } from './constants'

// ========== 体重记录 CRUD ==========

/**
 * 保存体重记录（同用户同日期自动覆盖）
 * @param {string} userId - 用户ID
 * @param {string} date - 日期 YYYY-MM-DD
 * @param {number} weight - 体重 kg
 * @param {string} note - 备注（可选）
 */
export async function saveWeight(userId, date, weight, note = '') {
  const db = await getDB()
  await db.put(STORES.WEIGHTS, { userId, date, weight, note, updatedAt: Date.now() })
}

/**
 * 获取指定用户指定日期的体重记录
 */
export async function getWeight(userId, date) {
  const db = await getDB()
  return db.get(STORES.WEIGHTS, [userId, date])
}

/**
 * 获取指定用户的所有体重记录（按日期升序）
 */
export async function getAllWeights(userId) {
  const db = await getDB()
  const records = await db.getAllFromIndex(STORES.WEIGHTS, 'userId', userId)
  return records.sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * 获取所有用户的体重记录
 */
export async function getAllWeightsForAllUsers() {
  const db = await getDB()
  const records = await db.getAll(STORES.WEIGHTS)
  return records.sort((a, b) => {
    if (a.userId !== b.userId) return a.userId.localeCompare(b.userId)
    return a.date.localeCompare(b.date)
  })
}

/**
 * 删除指定日期体重记录
 */
export async function deleteWeight(userId, date) {
  const db = await getDB()
  await db.delete(STORES.WEIGHTS, [userId, date])
}

// ========== 训练打卡 CRUD ==========

/**
 * 保存训练打卡记录（同用户同日期自动覆盖）
 * @param {string} userId - 用户ID
 * @param {string} date - 日期 YYYY-MM-DD
 * @param {string} part - 训练部位
 * @param {string} note - 备注（可选）
 */
export async function saveWorkout(userId, date, part, note = '') {
  const db = await getDB()
  await db.put(STORES.WORKOUTS, { userId, date, part, note, updatedAt: Date.now() })
}

/**
 * 获取指定用户指定日期的训练打卡
 */
export async function getWorkout(userId, date) {
  const db = await getDB()
  return db.get(STORES.WORKOUTS, [userId, date])
}

/**
 * 获取指定用户的所有训练记录（按日期降序）
 */
export async function getAllWorkouts(userId) {
  const db = await getDB()
  const records = await db.getAllFromIndex(STORES.WORKOUTS, 'userId', userId)
  return records.sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * 获取所有用户的训练记录
 */
export async function getAllWorkoutsForAllUsers() {
  const db = await getDB()
  const records = await db.getAll(STORES.WORKOUTS)
  return records.sort((a, b) => {
    if (a.userId !== b.userId) return a.userId.localeCompare(b.userId)
    return b.date.localeCompare(a.date)
  })
}

/**
 * 删除指定日期训练记录
 */
export async function deleteWorkout(userId, date) {
  const db = await getDB()
  await db.delete(STORES.WORKOUTS, [userId, date])
}
