import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const weights = await kv.get('weights');
    return res.json(weights || []);
  }

  if (method === 'POST') {
    const { userId, date, weight, note } = req.body;
    const record = { userId, date, weight, note, updatedAt: Date.now() };
    
    let weights = await kv.get('weights') || [];
    const existingIndex = weights.findIndex(
      w => w.userId === userId && w.date === date
    );
    
    if (existingIndex >= 0) {
      weights[existingIndex] = record;
    } else {
      weights.push(record);
    }
    
    await kv.set('weights', weights);
    return res.json({ success: true, record });
  }

  if (method === 'DELETE') {
    const { userId, date } = req.query;
    let weights = await kv.get('weights') || [];
    weights = weights.filter(w => !(w.userId === userId && w.date === date));
    await kv.set('weights', weights);
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
