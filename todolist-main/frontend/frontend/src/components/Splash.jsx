import Ico from './Icons';

export default function Splash({ out }) {
  return (
    <div className={`splash ${out ? 'out' : ''}`} role="status" aria-live="polite">
      <div className="scene">
        <div className="cube">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <b key={n} className="f"><Ico n="check" style={{ width: 30, height: 30, strokeWidth: 3, color: '#fff' }} /></b>
          ))}
        </div>
        <i className="floor" />
      </div>
      <div className="bar"><i /></div>
      <p>Carregando suas tarefas…</p>
    </div>
  );
}
