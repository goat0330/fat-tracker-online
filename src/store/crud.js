const API_BASE = '/api';

// ========== 体重记录 CRUD ==========

/**
 * 保存体重记录（同用户同日期自动覆盖）
 */
export async function saveWeight(userId, date, weight, note = '') {
  const res = await fetch(`${API_BASE}/weights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, date, weight, note })
  });
  return res.json();
}

/**
 * 获取指定用户指定日期的体重记录
 */
export async function getWeight(userId, date) {
  const records = await getAllWeightsForAllUsers();
  return records.find(w => w.userId === userId && w.date === date);
}

/**
 * 获取指定用户的所有体重记录（按日期升序）
 */
export async function getAllWeights(userId) {
  const records = await getAllWeightsForAllUsers();
  return records
    .filter(w => w.userId === userId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 获取所有用户的体重记录
 */
export async function getAllWeightsForAllUsers() {
  const res = await fetch(`${API_BASE}/weights`);
  const records = await res.json();
  return records.sort((a, b) => {
    if (a.userId !== b.userId) return a.userId.localeCompare(b.userId);
    return a.date.localeCompare(b.date);
  });
}

/**
 * 删除指定日期体重记录
 */
export async function deleteWeight(userId, date) {
  await fetch(`${API_BASE}/weights?userId=${userId}&date=${date}`, {
    method: 'DELETE'
  });
}

// ========== 训练打卡 CRUD ==========

/**
 * 保存训练打卡记录（同用户同日期自动覆盖）
 */
export async function saveWorkout(userId, date, part, note = '') {
  const res = await fetch(`${API_BASE}/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, date, part, note })
  });
  return res.json();
}

/**
 * 获取指定用户指定日期的训练打卡
 */
export async function getWorkout(userId, date) {
  const records = await getAllWorkoutsForAllUsers();
  return records.find(w => w.userId === userId && w.date === date);
}

/**
 * 获取指定用户的所有训练记录（按日期降序）
 */
export async function getAllWorkouts(userId) {
  const records = await getAllWorkoutsForAllUsers();
  return records
    .filter(w => w.userId === userId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * 获取所有用户的训练记录
 */
export async function getAllWorkoutsForAllUsers() {
  const res = await fetch(`${API_BASE}/workouts`);
  const records = await res.json();
  return records.sort((a, b) => {
    if (a.userId !== b.userId) return a.userId.localeCompare(b.userId);
    return b.date.localeCompare(a.date);
  });
}

/**
 * 删除指定日期训练记录
 */
export async function deleteWorkout(userId, date) {
  await fetch(`${API_BASE}/workouts?userId=${userId}&date=${date}`, {
    method: 'DELETE'
  });
}