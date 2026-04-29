import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Upload, CheckCircle2, Bot } from 'lucide-react';
import { CHAT_MESSAGES } from '../data.js';

export default function ReportPage() {
  const [msg, setMsg] = useState('');
  const [formData, setFormData] = useState({ type: 'Pothole', desc: '', location: 'Golden Nest Colony', name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' };
  const inputStyle = {
    width: '100%', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#0c1445', outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', fontFamily: "'Inter', sans-serif" }}>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 40, fontWeight: 800, textAlign: 'center', color: '#0c1445', marginBottom: 8 }}>
        Report an Issue
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 48 }}>
        Use our AI assistant or fill the form to report a civic issue
      </motion.p>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass" style={{ padding: '64px 48px', textAlign: 'center', maxWidth: 500, margin: '0 auto', borderRadius: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={32} color="#10b981" />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0c1445', marginBottom: 8 }}>Complaint Submitted!</h2>
            <p style={{ fontSize: 15, color: '#64748b', marginBottom: 8 }}>Your complaint has been registered successfully.</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#0ea5e9', marginBottom: 32 }}>#MB-2891</p>
            <button onClick={() => setSubmitted(false)} className="glass hover-lift" style={{
              padding: '10px 24px', fontSize: 14, fontWeight: 600, color: '#0c1445', border: 'none', cursor: 'pointer', borderRadius: 12, fontFamily: 'Inter, sans-serif',
            }}>Submit Another</button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>

            {/* AI Chat */}
            <div className="glass" style={{ borderRadius: 24, overflow: 'hidden', height: 560, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0ea5e9' }} className="animate-pulse-dot" />
                <span style={{ fontSize: 16, fontWeight: 700, color: '#0c1445' }}>CivicAI Assistant</span>
                <Bot size={16} color="#94a3b8" style={{ marginLeft: 'auto' }} />
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {CHAT_MESSAGES.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                    style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '85%', padding: '14px 18px', fontSize: 14, lineHeight: 1.6,
                      borderRadius: m.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: m.from === 'user' ? '#0ea5e9' : 'rgba(14,165,233,0.08)',
                      color: m.from === 'user' ? 'white' : '#0c1445',
                    }}>{m.text}</div>
                  </motion.div>
                ))}
              </div>
              <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 12 }}>
                <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Describe your issue..."
                  style={{ flex: 1, background: 'rgba(0,0,0,0.04)', border: 'none', borderRadius: 12, padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0c1445' }} />
                <button style={{
                  background: '#0ea5e9', color: 'white', width: 44, height: 44, borderRadius: 12,
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Send size={16} /></button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="glass" style={{ borderRadius: 24, padding: 40 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0c1445', marginBottom: 32 }}>Issue Details</h3>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Issue Type</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={inputStyle}>
                  {['Pothole', 'Water Supply', 'Waste / Garbage', 'Streetlight', 'Drainage', 'Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Description</label>
                <textarea value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} rows={3}
                  placeholder="Describe the issue in detail..."
                  style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Location</label>
                <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Your Name</label>
                  <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Optional" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Optional" style={inputStyle} />
                </div>
              </div>

              <button type="button" style={{
                width: '100%', border: '2px dashed rgba(14,165,233,0.3)', background: 'rgba(14,165,233,0.04)',
                borderRadius: 12, padding: 20, fontSize: 14, color: '#0ea5e9', textAlign: 'center', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Inter, sans-serif',
                marginBottom: 20,
              }}><Upload size={16} /> Upload Photo</button>

              <button type="submit" className="hover-lift" style={{
                width: '100%', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 14,
                padding: 16, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>Submit Complaint →</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
