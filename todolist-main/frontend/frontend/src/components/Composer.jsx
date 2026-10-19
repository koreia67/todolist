import { useState } from 'react';
import Ico from './Icons';
import { LISTS } from '../meta';
import { ripple } from '../fx';
import { dueLabel } from '../dates';

export default function Composer({ sort, onSort, onAdd }) {
  const [title, setTitle] = useState('');
  const [list, setList] = useState('Pessoal');
  const [date, setDate] = useState('');
  const [imp, setImp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setShake(true); setTimeout(() => setShake(false), 450); return; }
    setBusy(true);
    const ok = await onAdd({ title: title.trim(), dueDate: date || null }, { list, important: imp });
    setBusy(false);
    if (ok) { setTitle(''); setDate(''); setImp(false); }
  };

  return (
    <form className="panel" onSubmit={submit}>
      <div className={`add ${shake ? 'shake' : ''}`}>
        <span className="plus"><Ico n="plus" /></span>
        <input value={title} maxLength={255} onChange={(e) => setTitle(e.target.value)} placeholder="Adicionar uma nova tarefa..." aria-label="Nova tarefa" />
        <button className="btn-pri" onPointerDown={ripple} disabled={busy}>{busy ? <i className="spin" /> : 'Adicionar'}</button>
      </div>

      <div className="opts">
        <label className="chip">
          <Ico n="list" />
          <select value={list} onChange={(e) => setList(e.target.value)} aria-label="Lista">
            {LISTS.map((l) => <option key={l.name}>{l.name}</option>)}
          </select>
          <Ico n="chev" className="chev" />
        </label>

        <label className="chip">
          <Ico n="cal" />
          <span>{date ? dueLabel(date) : 'Definir data'}</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} onClick={(e) => e.currentTarget.showPicker?.()} aria-label="Definir data" />
        </label>

        <button type="button" className={`chip ${imp ? 'on' : ''}`} onClick={() => setImp(!imp)} aria-pressed={imp}>
          <Ico n="star" fill={imp} />Marcar como importante
        </button>

        <label className="chip grow">
          <Ico n="sort" />
          <select value={sort} onChange={(e) => onSort(e.target.value)} aria-label="Ordenar">
            <option value="prazo">Prazo mais próximo</option>
            <option value="recentes">Mais recentes</option>
            <option value="az">Ordem alfabética</option>
          </select>
          <Ico n="chev" className="chev" />
        </label>
      </div>
    </form>
  );
}
