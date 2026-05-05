import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Upload, CheckCircle2, Bot, Loader2, ArrowRight } from 'lucide-react';
import { CHAT_MESSAGES } from '../data.js';
import { supabase, assignWard, generateComplaintId } from '../supabase.js';

export default function ReportPage({ isMobile, onNavigate }) {
  const m = isMobile;
  const [msg, setMsg] = useState('');
  const [formData, setFormData] = useState({ type: 'Pothole', desc: '', location: '', name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorToast, setErrorToast] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.type) errs.type = 'Please select an issue type';
    if (!formData.desc.trim()) errs.desc = 'Please describe the issue';
    if (!formData.location.trim()) errs.location = 'Please enter a location';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const complaint_id = generateComplaintId();
    const ward = assignWard(formData.location);

    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert([{
          complaint_id,
          issue_type: formData.type,
          description: formData.desc,
          location: formData.location,
          name: formData.name || null,
          phone: formData.phone || null,
          ward,
          status: 'Open',
        }]);

      if (error) throw error;

      setSubmittedId(complaint_id);
      setSubmitted(true);
    } catch (err) {
      console.log('Supabase insert error:', err);
      setErrorToast('Failed to submit. Please try again.');
      setTimeout(() => setErrorToast(''), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ type: 'Pothole', desc: '', location: '', name: '', phone: '' });
    setErrors({});
    setSubmitted(false);
    setSubmittedId('');
  };

  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' };
  const inputStyle = { width: '100%', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '12px 16px', fontSize: m ? 16 : 14, color: '#0c1445', outline: 'none', fontFamily: 'Inter, sans-serif' };
  const inputErrorStyle = { ...inputStyle, border: '1px solid #ef4444', background: 'rgba(239,68,68,0.04)' };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: m ? '80px 16px 80px' : '80px 24px', fontFamily: "'Inter', sans-serif" }}>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: m ? 28 : 40, fontWeight: 800, textAlign: 'center', color: '#0c1445', marginBottom: 8 }}>Report an Issue</motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: m ? 32 : 48 }}>Use our AI assistant or fill the form to report a civic issue</motion.p>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass" style={{ padding: m ? '40px 24px' : '64px 48px', textAlign: 'center', maxWidth: 500, margin: '0 auto', borderRadius: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle2 size={64} color="#10b981" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0c1445', marginBottom: 8 }}>Complaint Submitted!</h2>
            <p style={{ fontSize: 15, color: '#64748b', marginBottom: 8 }}>Your complaint ID is</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#0ea5e9', marginBottom: 8 }}>#{submittedId}</p>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 32 }}>Screenshot this ID to track your complaint</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <button onClick={() => { if (onNavigate) onNavigate('track', submittedId); }} className="hover-lift" style={{
                width: '100%', maxWidth: 280, background: '#0ea5e9', color: 'white', border: 'none',
                borderRadius: 14, padding: '14px 24px', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif', minHeight: 48,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>Track This Complaint <ArrowRight size={16} /></button>
              <button onClick={resetForm} style={{
                width: '100%', maxWidth: 280, background: 'transparent', color: '#64748b',
                border: '1px solid rgba(0,0,0,0.1)', borderRadius: 14, padding: '12px 24px',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', minHeight: 48,
              }}>Report Another Issue</button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? 24 : 32, alignItems: 'start' }}>
            <div className="glass" style={{ borderRadius: 24, overflow: 'hidden', height: m ? 320 : 560, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0ea5e9' }} className="animate-pulse-dot" />
                <span style={{ fontSize: 16, fontWeight: 700, color: '#0c1445' }}>CivicAI Assistant</span>
                <Bot size={16} color="#94a3b8" style={{ marginLeft: 'auto' }} />
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: m ? 16 : 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {CHAT_MESSAGES.map((cm, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                    style={{ display: 'flex', justifyContent: cm.from === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '85%', padding: '14px 18px', fontSize: 14, lineHeight: 1.6, borderRadius: cm.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: cm.from === 'user' ? '#0ea5e9' : 'rgba(14,165,233,0.08)', color: cm.from === 'user' ? 'white' : '#0c1445' }}>{cm.text}</div>
                  </motion.div>
                ))}
              </div>
              <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 12 }}>
                <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Describe your issue..." style={{ flex: 1, background: 'rgba(0,0,0,0.04)', border: 'none', borderRadius: 12, padding: '12px 16px', fontSize: m ? 16 : 14, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0c1445' }} />
                <button style={{ background: '#0ea5e9', color: 'white', width: 44, height: 44, borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send size={16} /></button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="glass" style={{ borderRadius: 24, padding: m ? '24px 20px' : 40 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0c1445', marginBottom: 32 }}>Issue Details</h3>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Issue Type</label>
                <select value={formData.type} onChange={e => { setFormData({ ...formData, type: e.target.value }); setErrors({ ...errors, type: '' }); }} style={errors.type ? inputErrorStyle : inputStyle}>
                  {['Pothole', 'Water Supply', 'Waste / Garbage', 'Streetlight', 'Drainage', 'Other'].map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.type && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{errors.type}</p>}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Description</label>
                <textarea value={formData.desc} onChange={e => { setFormData({ ...formData, desc: e.target.value }); setErrors({ ...errors, desc: '' }); }} rows={3} placeholder="Describe the issue in detail..." style={{ ...(errors.desc ? inputErrorStyle : inputStyle), minHeight: 100, resize: 'vertical' }} />
                {errors.desc && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{errors.desc}</p>}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Location</label>
                <input value={formData.location} onChange={e => { setFormData({ ...formData, location: e.target.value }); setErrors({ ...errors, location: '' }); }} placeholder="e.g. Golden Nest Colony, Bhayandar Station..." style={errors.location ? inputErrorStyle : inputStyle} />
                {errors.location && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{errors.location}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div><label style={labelStyle}>Your Name</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Optional" style={inputStyle} /></div>
                <div><label style={labelStyle}>Phone</label><input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Optional" style={inputStyle} /></div>
              </div>

              <button type="button" style={{ width: '100%', border: '2px dashed rgba(14,165,233,0.3)', background: 'rgba(14,165,233,0.04)', borderRadius: 12, padding: m ? 16 : 20, fontSize: 14, color: '#0ea5e9', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Inter, sans-serif', marginBottom: 20, minHeight: 48 }}><Upload size={16} /> Upload Photo</button>

              <button type="submit" disabled={submitting} className="hover-lift" style={{
                width: '100%', background: submitting ? '#7dd3fc' : '#0ea5e9', color: 'white', border: 'none', borderRadius: 14,
                padding: 16, fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif', minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: submitting ? 0.8 : 1, transition: 'all 0.2s ease',
              }}>
                {submitting ? (
                  <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</>
                ) : (
                  <>Submit Complaint →</>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {errorToast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              padding: '12px 24px', borderRadius: 14, fontSize: 14, fontWeight: 600,
              boxShadow: '0 8px 32px rgba(239,68,68,0.15)',
            }}>
            {errorToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
