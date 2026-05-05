import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, Clock, Share2, ArrowUpCircle, Loader2, SearchX, PartyPopper } from 'lucide-react';
import { STEPPER_STAGES } from '../data.js';
import { supabase, formatDate } from '../supabase.js';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }) };

/* ── Demo fallback complaint ── */
const DEMO_COMPLAINT = {
  complaint_id: 'MB-2847',
  issue_type: 'Large Pothole — 2ft wide',
  description: 'Large pothole near Navghar Road bus stop, very dangerous for vehicles',
  location: 'Navghar Road, Bus Stop',
  ward: 'Ward 7',
  name: 'Demo User',
  status: 'In Progress',
  created_at: '2026-06-12T10:23:00Z',
};

const DEMO_UPDATES = [
  { time: 'Jun 13, 9:45 AM', text: 'Work crew dispatched to location' },
  { time: 'Jun 13, 9:00 AM', text: 'Staff Officer R. Sharma assigned to complaint' },
  { time: 'Jun 12, 2:15 PM', text: 'Complaint acknowledged by Ward 7 office' },
  { time: 'Jun 12, 10:23 AM', text: 'Complaint #MB-2847 submitted successfully' },
];

function getActiveStep(status) {
  switch (status) {
    case 'Open': return 1;
    case 'Acknowledged': return 2;
    case 'In Progress': return 3;
    case 'Resolved': return 5;
    default: return 1;
  }
}

function getStatusBadge(status) {
  switch (status) {
    case 'Open': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)', label: 'Open' };
    case 'Acknowledged': return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'rgba(59,130,246,0.2)', label: 'Acknowledged' };
    case 'In Progress': return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)', label: 'In Progress' };
    case 'Resolved': return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)', label: 'Resolved' };
    default: return { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'rgba(148,163,184,0.2)', label: status };
  }
}

/* ── Skeleton loader ── */
function SkeletonBlock({ width, height, style }) {
  return (
    <div style={{
      width: width || '100%', height: height || 20, borderRadius: 8,
      background: 'linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.06) 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  );
}

export default function TrackPage({ isMobile, initialId }) {
  const m = isMobile;
  const [query, setQuery] = useState(initialId || 'MB-2847');
  const [searched, setSearched] = useState(!initialId);
  const [complaint, setComplaint] = useState(initialId ? null : DEMO_COMPLAINT);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(!!initialId);
  const [isDemo, setIsDemo] = useState(!initialId);

  // Auto-search if initialId is provided
  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  async function handleSearch(searchOverride) {
    const searchValue = (searchOverride || query).trim().toUpperCase();
    if (!searchValue) return;

    // Check for demo complaint
    if (searchValue === 'MB-2847') {
      setComplaint(DEMO_COMPLAINT);
      setSearched(true);
      setNotFound(false);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    setNotFound(false);
    setIsDemo(false);

    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('complaint_id', searchValue)
        .single();

      if (error || !data) {
        setComplaint(null);
        setNotFound(true);
      } else {
        setComplaint(data);
        setNotFound(false);
      }
    } catch (err) {
      console.log('Supabase fetch error:', err);
      setComplaint(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  const activeStep = complaint ? getActiveStep(complaint.status) : 0;
  const badge = complaint ? getStatusBadge(complaint.status) : {};

  const updates = isDemo ? DEMO_UPDATES : complaint ? [
    { time: formatDate(complaint.created_at), text: `Complaint #${complaint.complaint_id} submitted successfully` },
  ] : [];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: m ? '80px 16px 80px' : '80px 24px', fontFamily: "'Inter', sans-serif" }}>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: m ? 28 : 40, fontWeight: 800, color: '#0c1445', textAlign: 'center', marginBottom: 8 }}>Track Your Complaint</motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 48 }}>Enter your complaint ID to see real-time status updates</motion.p>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass" style={{ display: 'flex', alignItems: 'center', padding: '6px 6px 6px 20px', borderRadius: 16, marginBottom: 40 }}>
        <input value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          placeholder="Enter Complaint ID (e.g. MB-2847)"
          style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 15, color: '#0c1445', outline: 'none', fontFamily: 'Inter, sans-serif' }} />
        <button onClick={() => handleSearch()} disabled={loading} className="hover-lift" style={{
          background: '#0ea5e9', color: 'white', borderRadius: 12,
          padding: m ? '10px' : '10px 24px', width: m ? 44 : 'auto', height: 44,
          fontSize: 14, fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'Inter, sans-serif',
        }}>
          {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
          {!m && (loading ? ' Searching...' : ' Search')}
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Loading state */}
        {loading && searched && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="glass" style={{ padding: m ? '24px 20px' : 40, borderRadius: 24, marginBottom: 24 }}>
              <SkeletonBlock width="40%" height={16} style={{ marginBottom: 12 }} />
              <SkeletonBlock width="30%" height={32} style={{ marginBottom: 24 }} />
              <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: 16 }}>
                <SkeletonBlock height={40} />
                <SkeletonBlock height={40} />
                <SkeletonBlock height={40} />
                <SkeletonBlock height={40} />
              </div>
              <SkeletonBlock height={120} style={{ marginTop: 24 }} />
            </div>
          </motion.div>
        )}

        {/* Not found */}
        {!loading && searched && notFound && (
          <motion.div key="notfound" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="glass" style={{ padding: m ? '40px 24px' : '64px 48px', textAlign: 'center', borderRadius: 24 }}>
            <SearchX size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0c1445', marginBottom: 8 }}>Complaint Not Found</h2>
            <p style={{ fontSize: 14, color: '#64748b' }}>Check your complaint ID and try again. IDs look like <strong>MB-4821</strong></p>
          </motion.div>
        )}

        {/* Found */}
        {!loading && searched && complaint && !notFound && (
          <motion.div key="found" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
            <motion.div variants={fadeUp} className="glass hover-lift" style={{ padding: m ? '24px 20px' : 40, borderRadius: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Complaint</span>
                  <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0ea5e9', marginTop: 4 }}>#{complaint.complaint_id}</h2>
                </div>
                <span style={{ display: 'inline-flex', background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 600 }}>{badge.label}</span>
              </div>

              {/* Resolved celebration */}
              {complaint.status === 'Resolved' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: 16, marginBottom: 24, textAlign: 'center' }}>
                  <PartyPopper size={24} color="#10b981" style={{ marginBottom: 8 }} />
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#10b981' }}>🎉 This complaint has been resolved!</p>
                </motion.div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? 16 : 24, marginTop: 32 }}>
                {[
                  { l: 'Issue', v: complaint.issue_type + (complaint.description ? ' — ' + complaint.description.substring(0, 40) : '') },
                  { l: 'Location', v: `${complaint.location}${complaint.ward ? ', ' + complaint.ward : ''}` },
                  { l: 'Reported By', v: complaint.name || 'Anonymous' },
                  { l: 'Submitted', v: formatDate(complaint.created_at) },
                ].map(d => (
                  <div key={d.l}>
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', display: 'block', marginBottom: 4 }}>{d.l}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#0c1445' }}>{d.v}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 40 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0c1445', marginBottom: 24 }}>Resolution Progress</h3>
                {STEPPER_STAGES.map((s, i) => {
                  const stageNum = i + 1;
                  const done = stageNum < activeStep;
                  const active = stageNum === activeStep;
                  const isResolved = complaint.status === 'Resolved';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: m ? 12 : 16 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: m ? 14 : 16, height: m ? 14 : 16, borderRadius: '50%', flexShrink: 0,
                          background: (done || isResolved) ? '#10b981' : active ? '#f59e0b' : 'rgba(0,0,0,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {(done || isResolved) && <CheckCircle2 size={8} color="white" />}
                          {active && !isResolved && <Clock size={7} color="white" />}
                        </div>
                        {i < STEPPER_STAGES.length - 1 && <div style={{ width: 2, height: 32, background: (done || isResolved) ? '#10b981' : 'rgba(0,0,0,0.08)', marginTop: 4 }} />}
                      </div>
                      <div style={{ paddingBottom: 12 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: (done || isResolved) ? '#10b981' : active ? '#f59e0b' : '#94a3b8' }}>{s.label}</span>
                        {active && !isResolved && <span style={{ marginLeft: 8, fontSize: 11, padding: '2px 10px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 999, fontWeight: 600 }}>Current</span>}
                        {(done || isResolved) && s.date && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{s.date}</p>}
                        {stageNum === 1 && complaint.created_at && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{formatDate(complaint.created_at)}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="glass hover-lift" style={{ padding: '24px 32px', borderRadius: 20, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0c1445', marginBottom: 16 }}>Activity Timeline</h3>
              {updates.map((u, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: m ? 4 : 24, padding: '12px 0', borderBottom: i < updates.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8', minWidth: 100, flexShrink: 0 }}>{u.time}</span>
                  <p style={{ fontSize: 13, color: '#0c1445' }}>{u.text}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} custom={2} style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: m ? 12 : 16 }}>
              <button className="glass hover-lift" style={{ flex: 1, padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#0c1445', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Inter, sans-serif', minHeight: 48 }}><Share2 size={15} /> Share Status</button>
              <button className="hover-lift" style={{ flex: 1, padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Inter, sans-serif', minHeight: 48 }}><ArrowUpCircle size={15} /> Escalate Issue</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
