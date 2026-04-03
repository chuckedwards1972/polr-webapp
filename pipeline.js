import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase.from('pipeline').select('*, members(name, campus)').order('updated_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.patch('/', auth, async (req, res) => {
  const { id, stage, notes } = req.body;
  const { data, error } = await supabase.from('pipeline')
    .update({ stage, notes: notes || '', updated_at: new Date().toISOString() })
    .eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.patch('/:id', auth, async (req, res) => {
  const { stage, notes } = req.body;
  const { data, error } = await supabase.from('pipeline')
    .update({ stage, notes: notes || '', updated_at: new Date().toISOString() })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
