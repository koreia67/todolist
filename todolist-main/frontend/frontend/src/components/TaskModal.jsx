import { useEffect, useRef, useState } from 'react';
import Ico from './Icons';
import { LISTS } from '../meta';
import { dayOf } from '../dates';
import { ripple } from '../fx';

export default function TaskModal({ task, meta, defaultDate, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || '');
  const [date, setDate] = useState(dayOf(task?.due_date) || defaultDate || '');
  const [list, setList] = useState(meta?.list || 'Pessoal');
  const [imp, setImp] = useState(!!meta?.important);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const input = useRef(null);

  useEffect(() => {
    input.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError('Dê um nome à tarefa.');
    setBusy(true);
    try {
      await onSave({ title: title.trim(), dueDate: date || null }, { list, important: imp });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const heading = task ? 'Editar tarefa' : 'Nova tarefa';
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="sheet" onSubmit={submit} role="dialog" aria-modal="true" aria-label={heading}>
        <h2>{heading}</h2>
        <label>
          O que precisa ser feito?
          <input ref={input} value={title} maxLength={255} onChange={(e) => { setTitle(e.target.value); setError(''); }} placeholder="Ex.: Ligar para o dentista" />
        </label>
        <label>
          Data limite (opcional)
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <div className="pick">
          {LISTS.map((l) => (
            <button type="button" key={l.name} className={list === l.name ? 'on' : ''} onClick={() => setList(l.name)} style={{ '--c': l.color }}>
              <span className="dot" style={{ '--c': l.color }} />{l.name}
            </button>
          ))}
        </div>
        <button type="button" className={`chip ${imp ? 'on' : ''}`} onClick={() => setImp(!imp)} aria-pressed={imp}>
          <Ico n="star" fill={imp} />Marcar como importante
        </button>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="row-btns">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-pri" onPointerDown={ripple} disabled={busy}>
            {busy ? <i className="spin" /> : task ? 'Salvar alterações' : 'Criar tarefa'}
          </button>
        </div>
      </form>
    </div>
  );
}
