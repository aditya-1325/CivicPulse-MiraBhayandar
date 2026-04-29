import { motion } from 'framer-motion';
import { ArrowRight, ClipboardList, BarChart3, Heart } from 'lucide-react';

export default function SurveyPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', fontFamily: "'Inter', sans-serif" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        className="glass" style={{ borderRadius: 28, padding: '64px 56px', maxWidth: 600, width: '100%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(14,165,233,0.1)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 160, height: 160, borderRadius: '50%', background: 'rgba(56,189,248,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
            <ClipboardList size={28} color="#0ea5e9" />
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0c1445', marginBottom: 12, lineHeight: 1.2 }}>
            Help Shape<br />Mira-Bhayandar's Future
          </h1>

          <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.7, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
            Your feedback directly influences how we improve civic services. This quick 2-minute survey helps us understand what matters most to you.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 32 }}>
            {[
              { icon: BarChart3, label: '2 min survey' },
              { icon: Heart, label: '1,847 responses' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
                <s.icon size={14} color="#0ea5e9" /> {s.label}
              </div>
            ))}
          </div>

          <button onClick={() => window.open('https://forms.gle/PtY8qcgMQuhwX77s6', '_blank')} className="hover-lift" style={{
            background: '#0ea5e9', color: 'white', padding: '16px 40px', borderRadius: 14,
            fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif',
          }}>Take the Survey <ArrowRight size={16} /></button>

          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 24 }}>Your responses are anonymous and help improve civic services for everyone.</p>
        </div>
      </motion.div>
    </div>
  );
}
