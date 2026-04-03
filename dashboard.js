import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const campus = req.user.level >= 2 ? req.user.campus : null;

    const [members, housing, missions, grants, meetings] = await Promise.all([
      supabase.from('members').select('id, status, campus', { count: 'exact' })
        .then(r => r.data || []),
      supabase.from('housing_residents').select('id, status, campus', { count: 'exact' })
        .then(r => r.data || []),
      supabase.from('missions').select('id, status, progress', { count: 'exact' })
        .then(r => r.data || []),
      supabase.from('grants').select('id, amount, status')
        .then(r => r.data || []),
      supabase.from('meetings').select('id, active')
        .then(r => r.data || []),
    ]);

    const filter = campus ? (arr) => arr.filter(x => x.campus === campus) : (arr) => arr;

    res.json({
      members:        { total: filter(members).length, active: filter(members).filter(m => m.status === 'Active').length },
      housing:        { total: filter(housing).length, occupied: filter(housing).filter(r => r.status === 'Active').length },
      missions:       { total: missions.length, active: missions.filter(m => m.status === 'active').length },
      grants:         { total: grants.length, totalValue: grants.reduce((s,g) => s + (parseFloat(g.amount)||0), 0) },
      meetings:       { total: meetings.length, active: meetings.filter(m => m.active).length },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
