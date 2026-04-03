import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase.from('meetings').select('*').order('day, time');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', auth, async (req, res) => {
  if (req.user.level > 1) return res.status(403).json({ error: 'Insufficient permissions' });
  const { data, error } = await supabase.from('meetings')
    .insert([{ ...req.body, campus: req.body.campus || req.user.campus, active: true }])
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.post('/:id', auth, async (req, res) => {
  const { data, error } = await supabase.from('meetings')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
