import { useState } from 'react';
import Ico from './Icons';
import { dayOf, dueLabel, todayStr } from '../dates';
import { listColor } from '../meta';

export default function TaskRow({ task, meta, index, leaving, onToggle, onStar, onEdit, onDelete }) {
  const [burst, setBurst] = useState(false);
  const due = dayOf(task.due_date);
  const done = !!task.completed;
  const late = !!due && !done && due < todayStr();

  const toggle = () => {
    if (!done) { setBurst(true); setTimeout(() => setBurst(false), 900); }
    onToggle(task);
  };

  return (
    <li className={`row ${done ? 'is-done' : ''} ${late ? 'is-late' : ''} ${leaving ? 'is-leaving' : ''}`} style={{ '--i': index }}>
      <button className={`box ${burst ? 'burst' : ''}`} onClick={toggle} aria-pressed={done} aria-label={done ? 'Reabrir tarefa' : 'Concluir tarefa'}>
        <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => <i key={n} data-k={n % 3} style={{ '--a': `${n * 45}deg` }} />)}
      </button>

      <div className="what">
        <span className="t">{task.title}</span>
        <span className="tag"><span className="dot" style={{ '--c': listColor(meta.list) }} />{meta.list}</span>
      </div>

      <div className="when">
        {due && <><Ico n="cal" />{dueLabel(due)}{late && <b className="late-pill">Em atraso</b>}</>}
      </div>

      <button className={`star ${meta.important ? 'on' : ''}`} onClick={() => onStar(task)} aria-pressed={meta.important} aria-label="Marcar como importante">
        <Ico n="star" fill={meta.important} />
      </button>

      <div className="acts">
        <button onClick={() => onEdit(task)} aria-label="Editar tarefa"><Ico n="edit" /></button>
        <button className="danger" onClick={() => onDelete(task)} aria-label="Excluir tarefa"><Ico n="trash" /></button>
      </div>
    </li>
  );
}
