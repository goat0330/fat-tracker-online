// Upstash Redis helper using REST API
const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key) {
  const res = await fetch(`${REST_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${REST_TOKEN}` }
  });
  const data = await res.json();
  return data.result ? JSON.parse(data.result) : null;
}

async function redisSet(key, value) {
  await fetch(`${REST_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REST_TOKEN}` },
    body: JSON.stringify(value)
  });
}

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const workouts = await redisGet('workouts');
    return res.json(workouts || []);
  }

  if (method === 'POST') {
    const { userId, date, part, note } = req.body;
    const record = { userId, date, part, note, updatedAt: Date.now() };

    let workouts = await redisGet('workouts') || [];
    const existingIndex = workouts.findIndex(
      w => w.userId === userId && w.date === date
    );

    if (existingIndex >= 0) {
      workouts[existingIndex] = record;
    } else {
      workouts.push(record);
    }

    await redisSet('workouts', workouts);
    return res.json({ success: true, record });
  }

  if (method === 'DELETE') {
    const { userId, date } = req.query;
    let workouts = await redisGet('workouts') || [];
    workouts = workouts.filter(w => !(w.userId === userId && w.date === date));
    await redisSet('workouts', workouts);
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
