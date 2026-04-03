import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/recent', auth, async (req, res) => {
  if (req.user.level > 1) return res.status(403).json({ error: 'Insufficient permissions' });
  const { data, error } = await supabase.from('audit_log')
    .select('*').order('created_at', { ascending: false }).limit(200);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/target/:id', auth, async (req, res) => {
  const { data, error } = await supabase.from('audit_log')
    .select('*').eq('entity_id', req.params.id)
    .order('created_at', { ascending: false }).limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
