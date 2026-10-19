import { useState } from 'react';
import { dayOf, dueLabel, todayStr } from '../dates';

export default function TaskItem({ task, index, leaving, onToggle, onEdit, onDelete }) {
  const [burst, setBurst] = useState(false);
  const due = dayOf(task.due_date);
  const done = !!task.completed;
  const late = !!due && !done && due < todayStr();

  const toggle = () => {
    if (!done) {
      setBurst(true);
      setTimeout(() => setBurst(false), 800);
    }
    onToggle(task);
  };

  return (
    <li className={`task ${done ? 'is-done' : ''} ${late ? 'is-late' : ''} ${leaving ? 'is-leaving' : ''}`} style={{ '--i': index }}>
      <button className={`check ${burst ? 'burst' : ''}`} onClick={toggle} aria-pressed={done} aria-label={done ? 'Reabrir tarefa' : 'Concluir tarefa'}>
        <svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" /></svg>
        {[0, 1, 2, 3, 4, 5].map((n) => <i key={n} style={{ '--a': `${n * 60}deg` }} />)}
      </button>

      <div className="body">
        <span className="title">{task.title}</span>
        {due && (
          <span className="due">
            {dueLabel(due)}
            {late && <b className="pill">Em atraso</b>}
          </span>
        )}
      </div>

      <div className="actions">
        <button onClick={() => onEdit(task)} aria-label="Editar tarefa">
          <svg className="ico" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
        </button>
        <button className="danger" onClick={() => onDelete(task)} aria-label="Excluir tarefa">
          <svg className="ico" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
        </button>
      </div>
    </li>
  );
}
