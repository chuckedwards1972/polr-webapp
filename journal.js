import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase.from('journal')
    .select('*').eq('user_id', req.user.userId)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', auth, async (req, res) => {
  const { type, content, step } = req.body;
  const { data, error } = await supabase.from('journal')
    .insert([{ user_id: req.user.userId, type: type || 'reflection', content, step: step || null }])
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

export default router;
