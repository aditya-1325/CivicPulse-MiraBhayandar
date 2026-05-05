import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Send, ExternalLink, Menu } from 'lucide-react';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TrackPage from './pages/TrackPage.jsx';
import ReportPage from './pages/ReportPage.jsx';
import SurveyPage from './pages/SurveyPage.jsx';
import { CHAT_MESSAGES } from './data.js';
import { useIsMobile } from './hooks.js';

const NAV_ITEMS = ['Home', 'Dashboard', 'Track', 'Report', 'Survey'];
const pageAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 },
};

/* ── Animated Background Orbs ── */
function BackgroundOrbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <div className="orb-1" style={{
        position: 'absolute', top: '-80px', left: '-100px',
        width: 600, height: 600, borderRadius: '50%',
        background: 'rgba(14,165,233,0.12)', filter: 'blur(80px)',
      }} />
      <div className="orb-2" style={{
        position: 'absolute', bottom: '-60px', right: '-80px',
        width: 500, height: 500, borderRadius: '50%',
        background: 'rgba(56,189,248,0.10)', filter: 'blur(80px)',
      }} />
      <div className="orb-3" style={{
        position: 'absolute', top: '35%', right: '15%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(186,230,253,0.15)', filter: 'blur(80px)',
      }} />
    </div>
  );
}

/* ── Mobile Hamburger Menu ── */
function MobileMenu({ open, onClose, onNavigate, onReport, currentPage }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            display: 'flex', flexDirection: 'column',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0ea5e9' }} />
              <span style={{ fontSize: 20, fontWeight: 700, color: '#0ea5e9' }}>CivicPulse</span>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, minHeight: 44, display: 'flex', alignItems: 'center' }}>
              <X size={24} color="#64748b" />
            </button>
          </div>
          <div style={{ flex: 1, paddingTop: 16 }}>
            {NAV_ITEMS.map(item => {
              const key = item.toLowerCase();
              const active = currentPage === key;
              return (
                <button key={key} onClick={() => { onNavigate(key); onClose(); }} style={{
                  display: 'flex', alignItems: 'center', width: '100%', padding: '16px 24px',
                  fontSize: 18, fontWeight: active ? 600 : 400,
                  color: active ? '#0ea5e9' : '#0c1445',
                  background: active ? 'rgba(14,165,233,0.06)' : 'none',
                  border: 'none', borderBottom: '1px solid rgba(0,0,0,0.06)',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', minHeight: 56,
                }}>{item}</button>
              );
            })}
            <div style={{ padding: '24px 24px 16px' }}>
              <button onClick={() => { onReport(); onClose(); }} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '14px 24px', background: '#ef4444', color: 'white',
                border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif', minHeight: 48,
              }}><AlertCircle size={18} /> Report Issue</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Navbar ── */
function Navbar({ page, onNavigate, onReport, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <nav className="glass-nav" style={{
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 48px', position: 'sticky', top: 0, zIndex: 40,
      }}>
        <button onClick={() => onNavigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', minHeight: 44 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0ea5e9' }} className="animate-pulse-dot" />
          <span style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: '#0ea5e9', fontFamily: 'Inter, sans-serif' }}>CivicPulse</span>
          {!isMobile && <span style={{ fontSize: 13, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>Mira-Bhayandar</span>}
        </button>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {NAV_ITEMS.map(item => {
              const key = item.toLowerCase();
              const active = page === key;
              return (
                <button key={key} onClick={() => onNavigate(key)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  color: active ? '#0ea5e9' : '#64748b',
                  fontFamily: 'Inter, sans-serif', transition: 'color 0.15s',
                }}>{item}</button>
              );
            })}
          </div>
        )}

        {/* Desktop Report Issue */}
        {!isMobile && (
          <button onClick={onReport} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#ef4444', color: 'white', border: 'none',
            borderRadius: 10, padding: '8px 18px', fontSize: 13,
            fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}><AlertCircle size={14} /> Report Issue</button>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button onClick={() => setMenuOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8, minHeight: 44, display: 'flex', alignItems: 'center',
          }}><Menu size={24} color="#0c1445" /></button>
        )}
      </nav>
      {isMobile && <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={onNavigate} onReport={onReport} currentPage={page} />}
    </>
  );
}

/* ── Report Modal ── */
function ReportModal({ open, onClose, isMobile }) {
  const [msg, setMsg] = useState('');
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: isMobile ? 16 : 0 }}>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }}
            className="glass" style={{ width: isMobile ? '100%' : 480, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0c1445' }}>Report Issue</h3>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Powered by CivicAI</span>
              </div>
              <button onClick={() => onClose(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', minHeight: 44, display: 'flex', alignItems: 'center' }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {CHAT_MESSAGES.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%', padding: '14px 18px', fontSize: 14, lineHeight: 1.6,
                    borderRadius: m.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: m.from === 'user' ? '#0ea5e9' : 'rgba(14,165,233,0.08)',
                    color: m.from === 'user' ? 'white' : '#0c1445',
                  }}>{m.text}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Describe your issue..."
                  style={{ flex: 1, background: 'rgba(0,0,0,0.04)', border: 'none', borderRadius: 12, padding: '12px 16px', fontSize: isMobile ? 16 : 14, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0c1445' }} />
                <button style={{ background: '#0ea5e9', color: 'white', width: 44, height: 44, borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send size={16} /></button>
              </div>
              <button onClick={() => onClose('submitted')} style={{ width: '100%', background: '#ef4444', color: 'white', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', minHeight: 48 }}>Submit Complaint</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Toast ── */
function Toast({ visible, message }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.2 }}
          className="glass" style={{ position: 'fixed', bottom: 80, left: 28, zIndex: 40, padding: '12px 20px', borderRadius: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#0c1445' }}>✓ {message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════ MAIN APP ═══════ */
export default function App() {
  const [page, setPage] = useState('home');
  const [trackId, setTrackId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const isMobile = useIsMobile();

  const navigate = useCallback((target, id) => {
    setPage(target);
    if (target === 'track' && id) setTrackId(id);
    else if (target !== 'track') setTrackId('');
  }, []);

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  }, []);

  const handleModalClose = (result) => {
    setModalOpen(false);
    if (result === 'submitted') showToast('Complaint #MB-2891 submitted successfully');
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif", position: 'relative', overflowX: 'hidden', width: '100%' }}>
      <BackgroundOrbs />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar page={page} onNavigate={navigate} onReport={() => setModalOpen(true)} isMobile={isMobile} />
        <div style={{ flex: 1, overflowY: page === 'dashboard' ? 'hidden' : 'auto' }}>
          <AnimatePresence mode="wait">
            {page === 'home' && <motion.div key="home" {...pageAnim}><HomePage onNavigate={navigate} isMobile={isMobile} /></motion.div>}
            {page === 'dashboard' && <motion.div key="dash" {...pageAnim} style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}><DashboardPage isMobile={isMobile} /></motion.div>}
            {page === 'track' && <motion.div key="track" {...pageAnim}><TrackPage isMobile={isMobile} initialId={trackId} /></motion.div>}
            {page === 'report' && <motion.div key="report" {...pageAnim}><ReportPage isMobile={isMobile} onNavigate={navigate} /></motion.div>}
            {page === 'survey' && <motion.div key="survey" {...pageAnim}><SurveyPage isMobile={isMobile} /></motion.div>}
          </AnimatePresence>
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => window.open('https://forms.gle/PtY8qcgMQuhwX77s6', '_blank')}
        className="hover-lift" style={{
          position: 'fixed', bottom: isMobile ? 16 : 28, right: isMobile ? 16 : 28, zIndex: 50,
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(14,165,233,0.4)', borderRadius: 14,
          padding: isMobile ? '10px 16px' : '12px 20px',
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: isMobile ? 13 : 14, fontWeight: 600, color: '#0ea5e9',
          boxShadow: '0 4px 20px rgba(14,165,233,0.15)',
          cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s ease',
          minHeight: 44,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#0ea5e9'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.color = '#0ea5e9'; }}>
        📋 Take Survey <ExternalLink size={13} />
      </button>

      <ReportModal open={modalOpen} onClose={handleModalClose} isMobile={isMobile} />
      <Toast {...toast} />
    </div>
  );
}
