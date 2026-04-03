import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/partners', auth, async (req, res) => {
  const { data, error } = await supabase.from('licensing_partners').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/partners', auth, async (req, res) => {
  if (req.user.level > 1) return res.status(403).json({ error: 'Insufficient permissions' });
  const { data, error } = await supabase.from('licensing_partners')
    .insert([{ ...req.body, created_by: req.user.userId }])
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.post('/revenue', auth, async (req, res) => {
  if (req.user.level > 1) return res.status(403).json({ error: 'Insufficient permissions' });
  const { data, error } = await supabase.from('licensing_revenue')
    .insert([{ ...req.body, recorded_by: req.user.userId }])
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

export default router;
