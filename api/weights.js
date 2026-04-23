// Upstash Redis helper using REST API
const REST_URL = process.env.KV_REST_API_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN;

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
    const weights = await redisGet('weights');
    return res.json(weights || []);
  }

  if (method === 'POST') {
    const { userId, date, weight, note } = req.body;
    const record = { userId, date, weight, note, updatedAt: Date.now() };

    let weights = await redisGet('weights') || [];
    const existingIndex = weights.findIndex(
      w => w.userId === userId && w.date === date
    );

    if (existingIndex >= 0) {
      weights[existingIndex] = record;
    } else {
      weights.push(record);
    }

    await redisSet('weights', weights);
    return res.json({ success: true, record });
  }

  if (method === 'DELETE') {
    const { userId, date } = req.query;
    let weights = await redisGet('weights') || [];
    weights = weights.filter(w => !(w.userId === userId && w.date === date));
    await redisSet('weights', weights);
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
