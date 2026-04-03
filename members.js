import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /members?page=1&limit=50&search=&state=&campus=
router.get('/', auth, async (req, res) => {
  const { page = 1, limit = 200, search = '', campus = '' } = req.query;
  const offset = (page - 1) * limit;

  let query = supabase.from('members').select('*', { count: 'exact' });

  // Campus filter (non-L0/L1 users only see their campus)
  const userLevel = req.user.level ?? 5;
  if (userLevel >= 2 && req.user.campus) {
    query = query.eq('campus', req.user.campus);
  } else if (campus) {
    query = query.eq('campus', campus);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  query = query.range(offset, offset + parseInt(limit) - 1).order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ members: data, total: count, page: parseInt(page), limit: parseInt(limit) });
});

// GET /members/:id
router.get('/:id', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Member not found' });
  res.json(data);
});

// POST /members
router.post('/', auth, async (req, res) => {
  if (req.user.level > 3)
    return res.status(403).json({ error: 'Insufficient permissions' });

  const { data, error } = await supabase
    .from('members')
    .insert([{ ...req.body, created_by: req.user.userId, campus: req.body.campus || req.user.campus }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PATCH /members/:id
router.patch('/:id', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('members')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /members/:id  (frontend uses POST for some updates)
router.post('/:id', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('members')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
