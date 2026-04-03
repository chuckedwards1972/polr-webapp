import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase.from('notifications')
    .select('*')
    .eq('user_id', req.user.userId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PATCH /notifications  (mark all read)
router.patch('/', auth, async (req, res) => {
  const { data, error } = await supabase.from('notifications')
    .update({ read: true, updated_at: new Date().toISOString() })
    .eq('user_id', req.user.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// PATCH /notifications/:id
router.patch('/:id', auth, async (req, res) => {
  const { data, error } = await supabase.from('notifications')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
