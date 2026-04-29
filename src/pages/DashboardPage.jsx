import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Clock, Search, AlertTriangle, User, X, MapPin, Activity, CircleDot } from 'lucide-react';
import { LOCATIONS, CATEGORIES, MAP_PINS, STEPPER_STAGES, ACTIVITY_ACTIONS } from '../data.js';

const iconMap = { plus: Plus, check: Check, user: User, clock: Clock, search: Search, alert: AlertTriangle };
const statusColor = { open: '#ef4444', progress: '#f59e0b', resolved: '#10b981' };

function LeftSidebar({ feedItems }) {
  return (
    <aside className="glass-sidebar" style={{
      width: 260, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.8)',
      padding: '24px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>Live Activity</span>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} className="animate-pulse-dot" />
      </div>
      <AnimatePresence initial={false}>
        {feedItems.slice(0, 6).map((item, i) => {
          const Icon = iconMap[item.icon] || Activity;
          const color = statusColor[item.status];
          return (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: i < 5 ? 1 : 0.3, y: 0 }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 0',
                borderBottom: '1px solid rgba(0,0,0,0.05)', borderLeft: `3px solid ${color}`, paddingLeft: 10,
              }}>
                <Icon size={14} style={{ color, marginTop: 2, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0c1445', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.action}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{item.location} · {item.time}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
}

function CityMap({ pins, heatmapOn, onPinClick }) {
  return (
    <svg viewBox="0 0 1000 700" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
      <rect width="1000" height="700" fill="#f0f7ff" />
      {[100,200,300,400,500,600].map(y => <line key={`h${y}`} x1={200} y1={y} x2={800} y2={y} stroke="rgba(14,165,233,0.12)" strokeWidth={1} />)}
      {[300,400,500,600,700].map(x => <line key={`v${x}`} x1={x} y1={50} x2={x} y2={680} stroke="rgba(14,165,233,0.12)" strokeWidth={1} />)}
      <line x1={480} y1={50} x2={480} y2={680} stroke="rgba(14,165,233,0.18)" strokeWidth={2} />
      <line x1={250} y1={350} x2={750} y2={350} stroke="rgba(14,165,233,0.15)" strokeWidth={1.5} />
      {/* Railway */}
      <line x1={490} y1={40} x2={490} y2={680} stroke="#d1d5db" strokeWidth={5} strokeDasharray="8 4" />
      <text x={498} y={55} fill="#9ca3af" fontSize="11" fontFamily="Inter" fontWeight="500">Western Railway</text>
      {/* Creek */}
      <path d="M 180 50 Q 200 150 220 250 Q 250 350 230 450 Q 210 550 240 650" fill="none" stroke="#93c5fd" strokeWidth={3} opacity={0.6} />
      <text x={158} y={320} fill="#60a5fa" fontSize="11" fontFamily="Inter" fontWeight="500" opacity={0.7} transform="rotate(-80,158,320)">Vasai Creek</text>
      {/* Heatmap */}
      {heatmapOn && (
        <g>
          <defs>
            {[{ cx:450,cy:150,r:80,c:'#ef4444' },{ cx:510,cy:420,r:70,c:'#ef4444' },{ cx:480,cy:280,r:60,c:'#f59e0b' },{ cx:500,cy:550,r:65,c:'#f59e0b' },{ cx:460,cy:470,r:50,c:'#0ea5e9' }].map((h,i) => (
              <radialGradient key={i} id={`hg${i}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={h.c} stopOpacity="0.12" /><stop offset="100%" stopColor={h.c} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>
          {[{ cx:450,cy:150,r:80 },{ cx:510,cy:420,r:70 },{ cx:480,cy:280,r:60 },{ cx:500,cy:550,r:65 },{ cx:460,cy:470,r:50 }].map((h,i) => (
            <circle key={i} cx={h.cx} cy={h.cy} r={h.r} fill={`url(#hg${i})`} />
          ))}
        </g>
      )}
      {/* Pins */}
      {pins.map((pin, i) => {
        const color = statusColor[pin.status];
        return (
          <motion.g key={pin.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05, duration: 0.4 }}
            style={{ cursor: 'pointer' }} onClick={() => onPinClick(pin)}>
            {pin.status === 'open' && (
              <>
                <circle cx={pin.x} cy={pin.y} r={14} fill="none" stroke={color} strokeWidth={1} className="animate-pulse-ring" style={{ transformOrigin: `${pin.x}px ${pin.y}px` }} />
                <circle cx={pin.x} cy={pin.y} r={14} fill="none" stroke={color} strokeWidth={0.8} className="animate-pulse-ring-d1" style={{ transformOrigin: `${pin.x}px ${pin.y}px` }} />
                <circle cx={pin.x} cy={pin.y} r={14} fill="none" stroke={color} strokeWidth={0.5} className="animate-pulse-ring-d2" style={{ transformOrigin: `${pin.x}px ${pin.y}px` }} />
              </>
            )}
            {pin.status === 'progress' && (
              <circle cx={pin.x} cy={pin.y} r={12} fill="none" stroke={color} strokeWidth={1.5} className="animate-pulse-soft" style={{ transformOrigin: `${pin.x}px ${pin.y}px` }} />
            )}
            <circle cx={pin.x} cy={pin.y} r={6} fill={color} />
            {pin.status === 'resolved' && <text x={pin.x} y={pin.y + 1.5} textAnchor="middle" fill="white" fontSize="7" fontWeight="700">✓</text>}
            {pin.label && <text x={pin.x + 12} y={pin.y - 8} fill="#64748b" fontSize="11" fontFamily="Inter" fontWeight="500">{pin.label}</text>}
          </motion.g>
        );
      })}
    </svg>
  );
}

function PinTooltip({ pin, onClose }) {
  if (!pin) return null;
  const color = statusColor[pin.status];
  const label = pin.status === 'open' ? 'Open' : pin.status === 'progress' ? 'In Progress' : 'Resolved';
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      style={{ position: 'absolute', left: `${(pin.x / 1000) * 100}%`, top: `${(pin.y / 700) * 100 - 6}%`, zIndex: 30 }}>
      <div className="glass" style={{ transform: 'translate(-50%, -100%)', padding: 16, minWidth: 200, borderRadius: 16 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={14} /></button>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#0c1445', marginBottom: 6 }}>{pin.issue}</p>
        <p style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {pin.location}</p>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{pin.date}</p>
        <span style={{ display: 'inline-block', marginTop: 8, padding: '3px 10px', fontSize: 11, fontWeight: 600, borderRadius: 999, color, background: `${color}15`, border: `1px solid ${color}30` }}>{label}</span>
      </div>
    </motion.div>
  );
}

function RightSidebar({ stepperIndex }) {
  const details = [
    { l: 'Issue', v: 'Pothole — Large, 2ft wide' },
    { l: 'Location', v: 'Navghar Road, Bus Stop' },
    { l: 'Assigned To', v: 'Ward Officer R. Sharma' },
    { l: 'Est. Resolution', v: '30 Apr 2026' },
  ];
  return (
    <aside className="glass-sidebar" style={{
      width: 280, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.8)',
      padding: '24px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>Tracker</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#0ea5e9' }}>#MB-2847</span>
      </div>
      {/* Stepper */}
      {STEPPER_STAGES.map((s, i) => {
        const done = i < stepperIndex;
        const active = i === stepperIndex;
        const dotColor = done ? '#10b981' : active ? '#f59e0b' : 'rgba(0,0,0,0.1)';
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor, flexShrink: 0 }}>
                {active && <div className="animate-pulse-soft" style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor }} />}
              </div>
              {i < STEPPER_STAGES.length - 1 && <div style={{ width: 2, height: 28, background: done ? '#10b981' : 'rgba(0,0,0,0.08)', marginTop: 2 }} />}
            </div>
            <div style={{ paddingBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: done ? '#10b981' : active ? '#f59e0b' : '#94a3b8' }}>{s.label}</span>
                {active && <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 999, fontWeight: 600 }}>In Progress</span>}
              </div>
              {done && s.date && <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.date}</p>}
            </div>
          </div>
        );
      })}
      {/* Details */}
      <div style={{ marginTop: 24, borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 16 }}>
        {details.map(d => (
          <div key={d.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{d.l}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0c1445', textAlign: 'right', maxWidth: 150 }}>{d.v}</span>
          </div>
        ))}
      </div>
      {/* Stats */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 16, display: 'flex', gap: 24 }}>
        <div>
          <span style={{ fontSize: 11, color: '#94a3b8', display: 'block' }}>Avg Resolution</span>
          <span style={{ fontSize: 14, fontWeight: 700 }}><span style={{ color: '#0ea5e9' }}>2.3</span> <span style={{ fontSize: 11, color: '#94a3b8' }}>days</span></span>
        </div>
        <div>
          <span style={{ fontSize: 11, color: '#94a3b8', display: 'block' }}>Satisfaction</span>
          <span style={{ fontSize: 14, fontWeight: 700 }}><span style={{ color: '#0ea5e9' }}>87</span><span style={{ fontSize: 11, color: '#94a3b8' }}>%</span></span>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardPage() {
  const [pins, setPins] = useState(MAP_PINS);
  const [selectedPin, setSelectedPin] = useState(null);
  const [feedItems, setFeedItems] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i, ...ACTIVITY_ACTIONS[i % ACTIVITY_ACTIONS.length],
      location: LOCATIONS[i % LOCATIONS.length], time: `${Math.floor(Math.random() * 20) + 1}m ago`,
    }))
  );
  const [stepperIndex, setStepperIndex] = useState(3);
  const [activeFilter, setActiveFilter] = useState('All Issues');
  const [heatmapOn, setHeatmapOn] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const feedIdRef = useRef(100);

  const showToast = useCallback((msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const a = ACTIVITY_ACTIONS[Math.floor(Math.random() * ACTIVITY_ACTIONS.length)];
      const l = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      setFeedItems(prev => [{ id: feedIdRef.current++, ...a, location: l, time: 'Just now' }, ...prev].slice(0, 7));
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setPins(prev => {
        const open = prev.filter(p => p.status === 'open');
        if (!open.length) return prev;
        const t = open[Math.floor(Math.random() * open.length)];
        showToast(`MB-${2800 + t.id} status updated`);
        return prev.map(p => p.id === t.id ? { ...p, status: 'progress' } : p);
      });
    }, 10000);
    return () => clearInterval(iv);
  }, [showToast]);

  useEffect(() => {
    const iv = setInterval(() => setStepperIndex(p => (p + 1) % STEPPER_STAGES.length), 30000);
    return () => clearInterval(iv);
  }, []);

  const stats = {
    open: pins.filter(p => p.status === 'open').length + 240,
    progress: pins.filter(p => p.status === 'progress').length + 84,
    resolved: pins.filter(p => p.status === 'resolved').length + 1197,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Stats bar */}
      <div style={{
        padding: '12px 24px', background: 'rgba(255,255,255,0.6)',
        borderBottom: '1px solid rgba(255,255,255,0.7)',
        display: 'flex', justifyContent: 'center', gap: 48, flexShrink: 0,
      }}>
        {[{ n: stats.open, l: 'Open', c: '#ef4444' }, { n: stats.progress, l: 'In Progress', c: '#f59e0b' }, { n: stats.resolved, l: 'Resolved', c: '#10b981' }].map(s => (
          <div key={s.l} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: s.c }}>{s.n}</span>
            <span style={{ fontSize: 12, color: '#64748b' }}>{s.l}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <LeftSidebar feedItems={feedItems} />

        {/* Map */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <CityMap pins={pins} heatmapOn={heatmapOn} onPinClick={setSelectedPin} />
          <AnimatePresence>{selectedPin && <PinTooltip pin={selectedPin} onClose={() => setSelectedPin(null)} />}</AnimatePresence>
          <button onClick={() => setHeatmapOn(p => !p)} className="hover-lift" style={{
            position: 'absolute', top: 12, right: 12, zIndex: 20,
            padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 999,
            border: heatmapOn ? '1px solid #0ea5e9' : '1px solid rgba(0,0,0,0.1)',
            background: heatmapOn ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.7)',
            color: heatmapOn ? '#0ea5e9' : '#64748b',
            backdropFilter: 'blur(10px)', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>Heatmap {heatmapOn ? 'ON' : 'OFF'}</button>
          {heatmapOn && (
            <div className="glass" style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 20, display: 'flex', gap: 12, padding: '6px 14px', borderRadius: 10 }}>
              {[{ c: '#ef4444', l: 'High' }, { c: '#f59e0b', l: 'Medium' }, { c: '#0ea5e9', l: 'Low' }].map(h => (
                <div key={h.l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: h.c }} />
                  <span style={{ fontSize: 11, color: '#64748b' }}>{h.l}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <RightSidebar stepperIndex={stepperIndex} />
      </div>

      {/* Bottom filter bar */}
      <div style={{
        height: 48, flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.7)',
        background: 'rgba(255,255,255,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveFilter(c)} style={{
            padding: '6px 16px', fontSize: 13, fontWeight: 500, borderRadius: 999, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
            border: c === activeFilter ? '1px solid #0ea5e9' : '1px solid rgba(0,0,0,0.08)',
            background: c === activeFilter ? 'rgba(14,165,233,0.08)' : 'transparent',
            color: c === activeFilter ? '#0ea5e9' : '#64748b',
          }}>{c}</button>
        ))}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="glass" style={{ position: 'fixed', bottom: 80, left: 28, zIndex: 40, padding: '12px 20px', borderRadius: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#0c1445', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CircleDot size={12} color="#0ea5e9" /> {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
