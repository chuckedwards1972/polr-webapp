import express from 'express';
import jwt from 'jsonwebtoken';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /auth/login
// Frontend sends: { username, password }
// username is the platform login (POLRHQ, etc.) stored as email in Supabase
router.post('/login', async (req, res) => {
  const { username, password, remember } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  // Supabase auth uses email — we store username as email field
  // Allow login by username or email
  const email = username.includes('@') ? username : `${username}@polrnetwork.internal`;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: 'Invalid credentials' });

  // Pull extended user profile from users table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', data.user.id)
    .single();

  const payload = {
    userId:   data.user.id,
    username: profile?.username || username,
    name:     profile?.name || username,
    level:    profile?.level ?? 5,
    campus:   profile?.campus || null,
    role:     profile?.role || 'member',
  };

  const expiresIn = remember ? '30d' : '7d';
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

  res.json({ token, user: payload });
});

// POST /auth/me (frontend calls this as POST per POLR_API)
router.post('/me', auth, (req, res) => {
  res.json(req.user);
});

// GET /auth/me — also support GET
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

// POST /auth/logout
router.post('/logout', auth, async (req, res) => {
  await supabase.auth.signOut().catch(() => {});
  res.json({ success: true });
});

export default router;
