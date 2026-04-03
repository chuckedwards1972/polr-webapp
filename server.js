import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes        from './routes/auth.js';
import memberRoutes      from './routes/members.js';
import dashboardRoutes   from './routes/dashboard.js';
import housingRoutes     from './routes/housing.js';
import pipelineRoutes    from './routes/pipeline.js';
import tasksRoutes       from './routes/tasks.js';
import journalRoutes     from './routes/journal.js';
import meetingsRoutes    from './routes/meetings.js';
import grantsRoutes      from './routes/grants.js';
import missionsRoutes    from './routes/missions.js';
import notifRoutes       from './routes/notifications.js';
import actionsRoutes     from './routes/actions.js';
import auditRoutes       from './routes/audit.js';
import licensingRoutes   from './routes/licensing.js';
import activityRoutes    from './routes/activity.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

// ── CORS ──
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://polrnetwork.com',
  'https://www.polrnetwork.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('CORS not allowed: ' + origin));
  },
  credentials: true,
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Request logging ──
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'production')
    console.log(`[POLR] ${req.method} ${req.path}`);
  next();
});

// ── Routes ──
app.use('/auth',          authRoutes);
app.use('/members',       memberRoutes);
app.use('/dashboard',     dashboardRoutes);
app.use('/housing',       housingRoutes);
app.use('/pipeline',      pipelineRoutes);
app.use('/tasks',         tasksRoutes);
app.use('/journal',       journalRoutes);
app.use('/meetings',      meetingsRoutes);
app.use('/grants',        grantsRoutes);
app.use('/missions',      missionsRoutes);
app.use('/notifications', notifRoutes);
app.use('/actions',       actionsRoutes);
app.use('/audit',         auditRoutes);
app.use('/licensing',     licensingRoutes);
app.use('/activity',      activityRoutes);

// ── Health check ──
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', ts: new Date().toISOString() });
});

// ── 404 ──
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Error handler ──
app.use((err, _req, res, _next) => {
  console.error('[POLR Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[POLR Backend] Running on port ${PORT}`);
  console.log(`[POLR Backend] Supabase: ${process.env.SUPABASE_URL ? '✅ connected' : '❌ MISSING'}`);
  console.log(`[POLR Backend] JWT:      ${process.env.JWT_SECRET ? '✅ set' : '❌ MISSING'}`);
});
