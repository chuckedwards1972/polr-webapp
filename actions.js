import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const logAction = async (userId, action, entityType, entityId, meta) => {
  await supabase.from('audit_log').insert([{
    user_id: userId, action, entity_type: entityType,
    entity_id: entityId, meta: meta || {}, created_at: new Date().toISOString()
  }]).catch(() => {});
};

// POST /actions/log
router.post('/log', auth, async (req, res) => {
  const { action, entityType, entityId, meta } = req.body;
  await logAction(req.user.userId, action, entityType, entityId, meta);
  res.json({ success: true });
});

// GET /actions/log/:entityId
router.get('/log/:entityId', auth, async (req, res) => {
  const { data, error } = await supabase.from('audit_log')
    .select('*').eq('entity_id', req.params.entityId)
    .order('created_at', { ascending: false }).limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /actions/recent
router.get('/recent', auth, async (req, res) => {
  const { data, error } = await supabase.from('audit_log')
    .select('*').order('created_at', { ascending: false }).limit(100);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /actions/call — log phone call to member
router.post('/call', auth, async (req, res) => {
  const { memberId, phone, outcome, notes } = req.body;
  await logAction(req.user.userId, 'PHONE_CALL', 'member', memberId, { phone, outcome, notes });
  res.json({ success: true });
});

// POST /actions/sms
router.post('/sms', auth, async (req, res) => {
  const { memberId, message } = req.body;
  await logAction(req.user.userId, 'SMS_SENT', 'member', memberId, { message });
  res.json({ success: true });
});

// POST /actions/follow-up
router.post('/follow-up', auth, async (req, res) => {
  const { memberId, type, notes, dueDate } = req.body;
  const { data, error } = await supabase.from('tasks').insert([{
    title: `Follow-up: ${type || 'General'}`,
    assigned_to: memberId, notes, due_date: dueDate,
    status: 'pending', created_by: req.user.userId
  }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /actions/resolve
router.post('/resolve', auth, async (req, res) => {
  const { alertId, resolution } = req.body;
  const { data, error } = await supabase.from('alerts')
    .update({ status: 'resolved', resolution, resolved_at: new Date().toISOString(), resolved_by: req.user.userId })
    .eq('id', alertId).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /actions/assign-prayer
router.post('/assign-prayer', auth, async (req, res) => {
  const { memberId, prayerId, assignedTo } = req.body;
  await logAction(req.user.userId, 'PRAYER_ASSIGNED', 'member', memberId, { prayerId, assignedTo });
  res.json({ success: true });
});

export default router;
