import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase.from('activity_feed')
    .select('*').order('created_at', { ascending: false }).limit(100);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
