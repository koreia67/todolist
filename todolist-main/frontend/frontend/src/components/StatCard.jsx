import { useEffect, useRef, useState } from 'react';
import Ico from './Icons';

const WAVES = [
  'M2 22C12 6 22 6 32 16S52 28 62 14 80 4 88 8',
  'M2 24C14 24 20 8 34 12S52 26 64 16 80 6 88 6',
  'M2 20C12 8 24 10 34 18S54 24 64 12 82 10 88 8',
  'M2 18C14 22 22 4 34 8S54 28 66 18 80 4 88 10',
];

function useCountUp(n) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const from = v, start = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - start) / 700);
      setV(Math.round(from + (n - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [n]);
  return v;
}

export default function StatCard({ label, value, tone, icon, d }) {
  const ref = useRef(null);
  const v = useCountUp(value);

  const move = (e) => {
    const el = ref.current, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${x * 10}deg`);
    el.style.setProperty('--rx', `${-y * 10}deg`);
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  };
  const leave = () => { ref.current.style.setProperty('--rx', '0deg'); ref.current.style.setProperty('--ry', '0deg'); };

  return (
    <div ref={ref} className="stat" style={{ '--t': tone, '--d': d }} onMouseMove={move} onMouseLeave={leave}>
      <span className="orb"><Ico n={icon} style={{ width: 24, height: 24, color: '#fff' }} /></span>
      <p>{label}</p>
      <strong>{v}</strong>
      <svg className="spark" viewBox="0 0 90 30"><path d={WAVES[d]} pathLength="1" /></svg>
    </div>
  );
}
