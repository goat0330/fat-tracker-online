import { openDB } from 'idb'
import { DB_NAME, DB_VERSION, STORES } from './constants'

/**
 * 初始化 IndexedDB 数据库
 * 创建体重记录和训练打卡两个 object store
 */
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 体重记录表：主键为 [userId, date]，保证每人每天只有一条记录
      if (!db.objectStoreNames.contains(STORES.WEIGHTS)) {
        const weightStore = db.createObjectStore(STORES.WEIGHTS, {
          keyPath: ['userId', 'date'],
        })
        weightStore.createIndex('userId', 'userId', { unique: false })
        weightStore.createIndex('date', 'date', { unique: false })
      }

      // 训练打卡表：主键为 [userId, date]，保证每人每天只有一条记录
      if (!db.objectStoreNames.contains(STORES.WORKOUTS)) {
        const workoutStore = db.createObjectStore(STORES.WORKOUTS, {
          keyPath: ['userId', 'date'],
        })
        workoutStore.createIndex('userId', 'userId', { unique: false })
        workoutStore.createIndex('date', 'date', { unique: false })
      }
    },
  })
}

/**
 * 获取数据库连接（复用单例）
 */
let dbPromise = null
function getDB() {
  if (!dbPromise) {
    dbPromise = initDB()
  }
  return dbPromise
}

export { getDB }
