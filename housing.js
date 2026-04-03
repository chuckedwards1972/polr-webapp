import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase.from('housing').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', auth, async (req, res) => {
  if (req.user.level > 1) return res.status(403).json({ error: 'Insufficient permissions' });
  const { data, error } = await supabase.from('housing').insert([req.body]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// /housing/residents
router.get('/residents', auth, async (req, res) => {
  let query = supabase.from('housing_residents').select('*').order('name');
  if (req.user.level >= 2 && req.user.campus)
    query = query.eq('campus', req.user.campus);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/residents', auth, async (req, res) => {
  const { data, error } = await supabase.from('housing_residents')
    .insert([{ ...req.body, campus: req.body.campus || req.user.campus }])
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.patch('/residents/:id', auth, async (req, res) => {
  const { data, error } = await supabase.from('housing_residents')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
