import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const workouts = await kv.get('workouts');
    return res.json(workouts || []);
  }

  if (method === 'POST') {
    const { userId, date, part, note } = req.body;
    const record = { userId, date, part, note, updatedAt: Date.now() };
    
    let workouts = await kv.get('workouts') || [];
    const existingIndex = workouts.findIndex(
      w => w.userId === userId && w.date === date
    );
    
    if (existingIndex >= 0) {
      workouts[existingIndex] = record;
    } else {
      workouts.push(record);
    }
    
    await kv.set('workouts', workouts);
    return res.json({ success: true, record });
  }

  if (method === 'DELETE') {
    const { userId, date } = req.query;
    let workouts = await kv.get('workouts') || [];
    workouts = workouts.filter(w => !(w.userId === userId && w.date === date));
    await kv.set('workouts', workouts);
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
