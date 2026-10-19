import { useState } from 'react';
import Ico from './Icons';
import { dayOf, fmt, todayStr } from '../dates';
import { listColor } from '../meta';

const WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function Calendar({ tasks, getMeta, onAddDay, onToggle, onEdit }) {
  const [cursor, setCursor] = useState(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); });
  const [sel, setSel] = useState(todayStr());
  const [dir, setDir] = useState(1);
  const y = cursor.getFullYear(), m = cursor.getMonth();

  const byDay = {};
  tasks.forEach((t) => { const d = dayOf(t.due_date); if (d) (byDay[d] ||= []).push(t); });

  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => fmt(new Date(y, m, i + 1)))];
  const go = (n) => { setDir(n); setCursor(new Date(y, m + n, 1)); };
  const today = () => { const n = new Date(); setDir(n > cursor ? 1 : -1); setCursor(new Date(n.getFullYear(), n.getMonth(), 1)); setSel(todayStr()); };
  const selTasks = byDay[sel] || [];

  return (
    <div className="cal panel">
      <div className="cal-head">
        <h2>{cursor.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
        <div>
          <button className="mini" onClick={() => go(-1)} aria-label="Mês anterior"><Ico n="left" /></button>
          <button className="chip" onClick={today}>Hoje</button>
          <button className="mini" onClick={() => go(1)} aria-label="Próximo mês"><Ico n="right" /></button>
        </div>
      </div>

      <div className="cal-grid wd">{WEEK.map((w) => <span key={w}>{w}</span>)}</div>
      <div key={`${y}-${m}`} className={`cal-grid ${dir > 0 ? 'next' : 'prev'}`}>
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const list = byDay[d] || [];
          return (
            <button key={d} className={`day ${d === todayStr() ? 'today' : ''} ${d === sel ? 'sel' : ''}`} onClick={() => setSel(d)} aria-label={`${Number(d.slice(8))}: ${list.length} tarefa(s)`}>
              <span>{Number(d.slice(8))}</span>
              <span className="dots">{list.slice(0, 3).map((t) => <i key={t.id} style={{ '--c': listColor(getMeta(t.id).list), opacity: t.completed ? 0.4 : 1 }} />)}</span>
            </button>
          );
        })}
      </div>

      <div className="day-panel" key={sel}>
        <div className="cal-head">
          <h3>{new Date(sel + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
          <button className="btn-pri" onClick={() => onAddDay(sel)}>Adicionar neste dia</button>
        </div>
        {selTasks.length === 0 && <p className="muted">Nenhuma tarefa com prazo neste dia.</p>}
        {selTasks.map((t) => (
          <div className={`mini-row ${t.completed ? 'is-done' : ''}`} key={t.id}>
            <button className="box on-ck" onClick={() => onToggle(t)} aria-pressed={!!t.completed} aria-label="Concluir tarefa">
              <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            </button>
            <span className="t" onClick={() => onEdit(t)}>{t.title}</span>
            <span className="tag"><span className="dot" style={{ '--c': listColor(getMeta(t.id).list) }} />{getMeta(t.id).list}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
