import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase.from('missions').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', auth, async (req, res) => {
  if (req.user.level > 1) return res.status(403).json({ error: 'Insufficient permissions' });
  const { data, error } = await supabase.from('missions')
    .insert([{ ...req.body, created_by: req.user.userId, status: 'active', progress: 0 }])
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

export default router;
