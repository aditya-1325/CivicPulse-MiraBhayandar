import { motion } from 'framer-motion';
import { MapPin, Activity, Shield, ArrowRight, FileText, Users, Zap, CheckCircle2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

function CountUp({ target, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const num = parseFloat(String(target).replace(/,/g, ''));
    const steps = 50;
    const inc = num / steps;
    let cur = 0;
    const iv = setInterval(() => {
      cur += inc;
      if (cur >= num) { setVal(num); clearInterval(iv); }
      else setVal(Math.floor(cur));
    }, 30);
    return () => clearInterval(iv);
  }, [target]);
  const display = target.toString().includes('.') ? (val >= parseFloat(target) ? target : val.toFixed(1)) : val.toLocaleString();
  return <>{display}{suffix}</>;
}

export default function HomePage({ onNavigate, isMobile }) {
  const m = isMobile; // shorthand
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", paddingBottom: m ? 80 : 0 }}>

      {/* ── HERO ── */}
      <section style={{ paddingTop: m ? 80 : 100, paddingBottom: m ? 48 : 80, textAlign: 'center', padding: m ? '80px 16px 48px' : '100px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)',
            color: '#0ea5e9', fontSize: 13, borderRadius: 999, padding: '6px 16px', marginBottom: 32,
          }}>
          🏙️ Mira-Bhayandar Municipal Corporation
        </motion.div>

        <motion.h1 initial="hidden" animate="visible" variants={stagger}
          style={{ fontSize: m ? 40 : 64, fontWeight: 800, lineHeight: m ? 1.15 : 1.1, letterSpacing: -2, color: '#0c1445', marginBottom: 24 }}>
          {['Your City.', 'Your Voice.'].map((line, i) => (
            <motion.span key={i} variants={fadeUp} custom={i} style={{ display: 'block' }}>{line}</motion.span>
          ))}
          <motion.span variants={fadeUp} custom={2} style={{
            display: 'block',
            background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Real Change.</motion.span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ fontSize: m ? 16 : 18, fontWeight: 400, color: '#64748b', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Report civic issues, track resolutions in real-time, and help build a better Mira-Bhayandar — powered by AI.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          style={{ display: 'flex', flexDirection: m ? 'column' : 'row', justifyContent: 'center', gap: m ? 12 : 16, marginBottom: 40, padding: m ? '0 16px' : 0 }}>
          <button onClick={() => onNavigate('report')} className="hover-lift" style={{
            background: '#0ea5e9', color: 'white', padding: '14px 28px', borderRadius: 12,
            fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Inter, sans-serif',
            width: m ? '100%' : 'auto', minHeight: 48,
          }}>Report an Issue <ArrowRight size={16} /></button>
          <button onClick={() => onNavigate('track')} className="hover-lift" style={{
            background: 'rgba(255,255,255,0.7)', color: '#0ea5e9', padding: '14px 28px', borderRadius: 12,
            fontSize: 15, fontWeight: 600, border: '1px solid rgba(14,165,233,0.3)',
            backdropFilter: 'blur(10px)', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            width: m ? '100%' : 'auto', minHeight: 48,
          }}>Track My Complaint</button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: m ? 12 : 32 }}>
          {['1,203 Issues Resolved', '94.2% Resolution Rate', '28 Wards Covered'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: m ? 12 : 13, color: '#64748b' }}>
              <CheckCircle2 size={14} color="#10b981" /> {t}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 16px' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: m ? 12 : 20 }}>
          {[
            { n: '247', l: 'Open Issues' },
            { n: '89', l: 'In Progress' },
            { n: '1,203', l: 'Resolved' },
            { n: '2.3', l: 'Avg Resolution', s: ' days' },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} className="glass hover-lift"
              style={{ padding: m ? '20px 16px' : '32px 24px', textAlign: 'center', borderRadius: 20 }}>
              <span style={{ fontSize: m ? 36 : 48, fontWeight: 800, color: '#0ea5e9', display: 'block', marginBottom: 8 }}>
                <CountUp target={s.n} suffix={s.s || ''} />
              </span>
              <span style={{ fontSize: m ? 12 : 13, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1000, margin: '0 auto 80px', padding: '0 16px' }}>
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ fontSize: m ? 26 : 32, fontWeight: 700, color: '#0c1445', textAlign: 'center', marginBottom: m ? 32 : 48 }}>
          Everything you need to make your city better
        </motion.h2>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, 1fr)', gap: m ? 16 : 24 }}>
          {[
            { icon: MapPin, title: 'Live Map Tracking', desc: 'See all civic issues plotted in real-time across all 28 wards' },
            { icon: Activity, title: 'Real-Time Updates', desc: 'Get instant notifications when your complaint status changes' },
            { icon: Shield, title: 'AI-Powered Triage', desc: 'Our AI categorizes and routes your issue to the right department instantly' },
          ].map((f, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} className="glass hover-lift"
              style={{ padding: m ? '24px 20px' : '40px 32px', borderRadius: 24 }}>
              <div style={{ width: 56, height: 56, background: 'rgba(14,165,233,0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <f.icon size={24} color="#0ea5e9" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0c1445', marginBottom: 12 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto 80px', padding: '0 16px' }}>
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ fontSize: m ? 26 : 32, fontWeight: 700, color: '#0c1445', textAlign: 'center', marginBottom: m ? 32 : 48 }}>
          How CivicPulse Works
        </motion.h2>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          style={{ display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: m ? 'stretch' : 'flex-start', gap: 0 }}>
          {[
            { n: '1', icon: FileText, title: 'Report', desc: 'Submit your issue via AI chat or form' },
            { n: '2', icon: Zap, title: 'AI Assigns', desc: 'CivicAI categorizes and routes instantly' },
            { n: '3', icon: Users, title: 'Staff Dispatched', desc: 'Ward officer assigned within hours' },
            { n: '4', icon: CheckCircle2, title: 'Resolved', desc: 'Issue fixed, you rate the service' },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} style={{ flex: m ? undefined : 1, display: 'flex', alignItems: 'center', marginBottom: m ? 12 : 0 }}>
              <div className="glass hover-lift" style={{
                padding: m ? '24px 20px' : '32px 24px', borderRadius: 20, flex: 1,
                textAlign: m ? 'left' : 'center',
                display: m ? 'flex' : 'block', alignItems: 'center', gap: m ? 16 : 0,
              }}>
                {m ? (
                  /* Mobile: horizontal card layout */
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 40 }}>
                      <span style={{ fontSize: 32, fontWeight: 900, color: 'rgba(14,165,233,0.15)' }}>{s.n}</span>
                    </div>
                    <div style={{ width: 44, height: 44, background: 'rgba(14,165,233,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <s.icon size={20} color="#0ea5e9" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0c1445', marginBottom: 4 }}>{s.title}</h3>
                      <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{s.desc}</p>
                    </div>
                  </>
                ) : (
                  /* Desktop: vertical card layout */
                  <>
                    <span style={{ fontSize: 48, fontWeight: 900, color: 'rgba(14,165,233,0.15)', display: 'block', marginBottom: 8 }}>{s.n}</span>
                    <div style={{ width: 44, height: 44, background: 'rgba(14,165,233,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <s.icon size={22} color="#0ea5e9" />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0c1445', marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{s.desc}</p>
                  </>
                )}
              </div>
              {!m && i < 3 && <ArrowRight size={20} color="rgba(14,165,233,0.3)" style={{ flexShrink: 0, margin: '0 4px' }} />}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── SURVEY CTA ── */}
      <section style={{ maxWidth: 800, margin: '0 auto 80px', padding: '0 16px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass" style={{
            padding: m ? '40px 24px' : '64px 48px', textAlign: 'center', borderRadius: 28,
            background: 'linear-gradient(135deg, rgba(14,165,233,0.06), rgba(56,189,248,0.04)), rgba(255,255,255,0.65)',
          }}>
          <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 800, color: '#0c1445', marginBottom: 16 }}>Help Us Improve Mira-Bhayandar</h2>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>Take our 2-minute survey and help shape the future of civic services in your city.</p>
          <button onClick={() => window.open('https://forms.gle/PtY8qcgMQuhwX77s6', '_blank')} className="hover-lift" style={{
            background: '#0ea5e9', color: 'white', padding: '16px 40px', borderRadius: 14,
            fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif',
            width: m ? '100%' : 'auto', justifyContent: 'center', minHeight: 48,
          }}>Take the Survey <ArrowRight size={16} /></button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.8)',
        padding: m ? '20px 16px' : '24px 48px',
        display: 'flex', flexDirection: m ? 'column' : 'row',
        alignItems: 'center', justifyContent: 'space-between', gap: m ? 12 : 0,
      }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>
          <strong style={{ color: '#0c1445' }}>CivicPulse</strong> Mira-Bhayandar
        </span>
        <div style={{ display: 'flex', gap: m ? 16 : 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Home', 'Dashboard', 'Track', 'Report', 'Survey'].map(l => (
            <button key={l} onClick={() => onNavigate(l.toLowerCase())} style={{
              background: 'none', border: 'none', fontSize: 13, color: '#64748b', cursor: 'pointer', fontFamily: 'Inter, sans-serif', minHeight: 44,
            }}>{l}</button>
          ))}
        </div>
        <span style={{ fontSize: 13, color: '#64748b' }}>© 2026 MBMC</span>
      </footer>
    </div>
  );
}
