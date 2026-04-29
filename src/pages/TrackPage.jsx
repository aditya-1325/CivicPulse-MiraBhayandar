import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, Clock, Share2, ArrowUpCircle } from 'lucide-react';
import { STEPPER_STAGES } from '../data.js';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }) };

export default function TrackPage() {
  const [query, setQuery] = useState('MB-2847');
  const [searched, setSearched] = useState(true);
  const activeStep = 3;

  const updates = [
    { time: 'Jun 13, 9:45 AM', text: 'Work crew dispatched to location' },
    { time: 'Jun 13, 9:00 AM', text: 'Staff Officer R. Sharma assigned to complaint' },
    { time: 'Jun 12, 2:15 PM', text: 'Complaint acknowledged by Ward 7 office' },
    { time: 'Jun 12, 10:23 AM', text: 'Complaint #MB-2847 submitted successfully' },
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px', fontFamily: "'Inter', sans-serif" }}>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 40, fontWeight: 800, color: '#0c1445', textAlign: 'center', marginBottom: 8 }}>
        Track Your Complaint
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 48 }}>
        Enter your complaint ID to see real-time status updates
      </motion.p>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass" style={{ display: 'flex', alignItems: 'center', padding: '6px 6px 6px 20px', borderRadius: 16, marginBottom: 40 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Enter Complaint ID (e.g. MB-2847)"
          style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 15, color: '#0c1445', outline: 'none', fontFamily: 'Inter, sans-serif' }} />
        <button onClick={() => setSearched(true)} className="hover-lift" style={{
          background: '#0ea5e9', color: 'white', borderRadius: 12, padding: '10px 24px',
          fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif',
        }}><Search size={14} /> Search</button>
      </motion.div>

      {searched && (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
          {/* Complaint card */}
          <motion.div variants={fadeUp} className="glass hover-lift" style={{ padding: 40, borderRadius: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Complaint</span>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0ea5e9', marginTop: 4 }}>#MB-2847</h2>
              </div>
              <span style={{
                display: 'inline-flex', background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
                border: '1px solid rgba(245,158,11,0.2)', borderRadius: 999, padding: '4px 14px',
                fontSize: 12, fontWeight: 600,
              }}>In Progress</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
              {[
                { l: 'Issue', v: 'Large Pothole — 2ft wide' },
                { l: 'Location', v: 'Navghar Road, Bus Stop, Ward 7' },
                { l: 'Assigned To', v: 'Ward Officer R. Sharma' },
                { l: 'Est. Resolution', v: 'Jun 15, 2026' },
              ].map(d => (
                <div key={d.l}>
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', display: 'block', marginBottom: 4 }}>{d.l}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#0c1445' }}>{d.v}</span>
                </div>
              ))}
            </div>

            {/* Stepper */}
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0c1445', marginBottom: 24 }}>Resolution Progress</h3>
              {STEPPER_STAGES.map((s, i) => {
                const done = i < activeStep;
                const active = i === activeStep;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        background: done ? '#10b981' : active ? '#f59e0b' : 'rgba(0,0,0,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {done && <CheckCircle2 size={10} color="white" />}
                        {active && <Clock size={8} color="white" />}
                      </div>
                      {i < STEPPER_STAGES.length - 1 && <div style={{ width: 2, height: 32, background: done ? '#10b981' : 'rgba(0,0,0,0.08)', marginTop: 4 }} />}
                    </div>
                    <div style={{ paddingBottom: 12 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: done ? '#10b981' : active ? '#f59e0b' : '#94a3b8' }}>{s.label}</span>
                      {active && <span style={{ marginLeft: 8, fontSize: 11, padding: '2px 10px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 999, fontWeight: 600 }}>In Progress</span>}
                      {done && s.date && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{s.date}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div variants={fadeUp} custom={1} className="glass hover-lift" style={{ padding: '24px 32px', borderRadius: 20, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0c1445', marginBottom: 16 }}>Activity Timeline</h3>
            {updates.map((u, i) => (
              <div key={i} style={{ display: 'flex', gap: 24, padding: '12px 0', borderBottom: i < updates.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', minWidth: 100, flexShrink: 0, paddingTop: 1 }}>{u.time}</span>
                <p style={{ fontSize: 13, color: '#0c1445' }}>{u.text}</p>
              </div>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} custom={2} style={{ display: 'flex', gap: 16 }}>
            <button className="glass hover-lift" style={{
              flex: 1, padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600,
              color: '#0c1445', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Inter, sans-serif',
            }}><Share2 size={15} /> Share Status</button>
            <button className="hover-lift" style={{
              flex: 1, padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600,
              background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Inter, sans-serif',
            }}><ArrowUpCircle size={15} /> Escalate Issue</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
