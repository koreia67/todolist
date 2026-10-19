import Ico from './Icons';
import { LISTS } from '../meta';
import peaks from '../assets/peaks.svg';

const ITEMS = [
  ['all', 'Minhas Tarefas', 'home'],
  ['today', 'Hoje', 'calcheck'],
  ['important', 'Importante', 'star'],
  ['completed', 'Concluídas', 'circleCheck'],
  ['calendar', 'Calendário', 'cal'],
];

export default function Sidebar({ active, onNav, list, onList, counts }) {
  const idx = ITEMS.findIndex((i) => i[0] === active);
  return (
    <aside className="side">
      <div className="brand">
        <div className="logo3d"><i><Ico n="check" style={{ width: 24, height: 24, strokeWidth: 3, color: '#fff' }} /></i></div>
        <b>Gus<span>Tasks</span></b>
      </div>

      <nav className="nav" aria-label="Principal">
        <i className="ind" style={{ transform: `translateY(${Math.max(idx, 0) * 58}px)`, opacity: idx < 0 ? 0 : 1 }} />
        {ITEMS.map(([k, label, icon]) => (
          <button key={k} className={active === k ? 'on' : ''} onClick={() => onNav(k)}><Ico n={icon} />{label}</button>
        ))}
      </nav>

      <p className="group">LISTAS</p>
      <div className="lists">
        {LISTS.map((l) => (
          <button key={l.name} className={list === l.name ? 'on' : ''} onClick={() => onList(l.name)}>
            <span className="dot" style={{ '--c': l.color }} />{l.name}<em>{counts[l.name] || 0}</em>
          </button>
        ))}
      </div>

      <div className="foot">
        <Ico n="bolt" fill style={{ color: 'var(--pri2)' }} />
        <p>Grandes resultados começam com pequenas tarefas.</p>
        <img src={peaks} alt="" />
      </div>
    </aside>
  );
}
