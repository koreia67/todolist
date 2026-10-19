import { useCallback, useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { api } from './api';
import { dayOf, todayStr } from './dates';
import { useMeta } from './meta';
import { ripple } from './fx';
import Ico from './components/Icons';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import Composer from './components/Composer';
import TaskRow from './components/TaskRow';
import TaskModal from './components/TaskModal';
import Calendar from './components/Calendar';
import Empty from './components/Empty';
import Splash from './components/Splash';

const TABS = [['all', 'Todas'], ['pending', 'Pendentes'], ['completed', 'Concluídas'], ['important', 'Importantes']];
const SORTS = {
  prazo: (a, b) => {
    const da = dayOf(a.due_date), db = dayOf(b.due_date);
    if (da && db && da !== db) return da < db ? -1 : 1;
    if (!da !== !db) return da ? -1 : 1;
    return b.id - a.id;
  },
  recentes: (a, b) => b.id - a.id,
  az: (a, b) => a.title.localeCompare(b.title, 'pt-BR'),
};

export default function App() {
  const { meta, get, patch } = useMeta();
  const [all, setAll] = useState({ tasks: [] });
  const [found, setFound] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState('tasks');
  const [tab, setTab] = useState('all');
  const [list, setList] = useState(null);
  const [today, setToday] = useState(false);
  const [sort, setSort] = useState('prazo');
  const [modal, setModal] = useState(null);
  const [phase, setPhase] = useState('loading');
  const [boot, setBoot] = useState('on');
  const [leaving, setLeaving] = useState(null);
  const [toast, setToast] = useState('');
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3200); };

  const loadAll = useCallback(async () => {
    try { setAll(await api.list('', 'all')); setPhase('ok'); } catch { setPhase('error'); }
  }, []);

  const refresh = async () => {
    await loadAll();
    if (search.trim()) setFound((await api.list(search.trim(), 'all')).tasks);
  };

  useEffect(() => {
    const min = new Promise((r) => setTimeout(r, 1100));
    Promise.all([loadAll(), min]).then(() => { setBoot('out'); setTimeout(() => setBoot('gone'), 700); });
  }, [loadAll]);

  useEffect(() => {
    if (!search.trim()) { setFound(null); return; }
    const t = setTimeout(async () => {
      try { setFound((await api.list(search.trim(), 'all')).tasks); } catch (e) { flash(e.message); }
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const mut = (fn) => { setAll((a) => ({ ...a, tasks: a.tasks.map(fn) })); setFound((f) => f && f.map(fn)); };

  const toggle = async (t) => {
    const completed = !t.completed;
    mut((x) => (x.id === t.id ? { ...x, completed } : x));
    try { await api.update(t.id, { completed }); } catch (e) { flash(e.message); loadAll(); }
  };

  const star = (t) => patch(t.id, { important: !get(t.id).important });

  const save = async (body, m) => {
    if (modal.task) { await api.update(modal.task.id, body); patch(modal.task.id, m); }
    else { const t = await api.create(body); patch(t.id, m); }
    setModal(null);
    await refresh();
  };

  const add = async (body, m) => {
    try { const t = await api.create(body); patch(t.id, m); await refresh(); return true; }
    catch (e) { flash(e.message); return false; }
  };

  const remove = (t) => {
    setLeaving(t.id);
    setTimeout(async () => {
      try { await api.remove(t.id); } catch (e) { flash(e.message); }
      setLeaving(null);
      refresh();
    }, 300);
  };

  const toggleTheme = (e) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const apply = () => { document.documentElement.dataset.theme = next; localStorage.setItem('gustavo:theme', next); setTheme(next); };
    if (!document.startViewTransition) return apply();
    const x = e.clientX, y = e.clientY;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(() => flushSync(apply)).ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
      )
    );
  };

  const nav = (k) => {
    if (k === 'calendar') return setPage('calendar');
    setPage('tasks'); setList(null); setToday(k === 'today');
    setTab(k === 'important' ? 'important' : k === 'completed' ? 'completed' : 'all');
  };
  const pickList = (l) => { setPage('tasks'); setToday(false); setTab('all'); setList((c) => (c === l ? null : l)); };
  const active = page === 'calendar' ? 'calendar' : list ? '' : today ? 'today' : tab === 'important' ? 'important' : tab === 'completed' ? 'completed' : 'all';

  const shown = useMemo(() => {
    const t = todayStr();
    return (found ?? all.tasks)
      .filter((x) => {
        const m = get(x.id);
        return (!today || dayOf(x.due_date) === t) && (!list || m.list === list) &&
          (tab === 'all' || (tab === 'pending' && !x.completed) || (tab === 'completed' && x.completed) || (tab === 'important' && m.important));
      })
      .sort(SORTS[sort]);
  }, [found, all, tab, list, today, sort, meta]);

  const total = all.tasks.length;
  const done = all.tasks.filter((t) => t.completed).length;
  const imp = all.tasks.filter((t) => get(t.id).important).length;
  const counts = {};
  all.tasks.forEach((t) => { const l = get(t.id).list; counts[l] = (counts[l] || 0) + 1; });

  const empty = search ? { title: 'Nenhuma tarefa encontrada.', text: 'Tente outro termo ou mude o filtro.' }
    : tab === 'completed' ? { title: 'Nenhuma tarefa concluída ainda.' }
    : tab === 'important' ? { title: 'Nenhuma tarefa importante.' }
    : today ? { title: 'Nada com prazo para hoje.' }
    : list ? { title: 'Esta lista está vazia.' }
    : { title: 'Você não tem tarefas pendentes.', action: 'Nova tarefa' };

  const dateLabel = `Hoje, ${new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}`;

  return (
    <div className="shell">
      <Sidebar active={active} onNav={nav} list={list} onList={pickList} counts={counts} />

      <main className="main">
        <header className="top">
          <div>
            <h1>{page === 'calendar' ? 'Calendário' : <>Olá, Gustavo! <span className="wave">👋</span></>}</h1>
            <p className="sub">{page === 'calendar' ? 'Veja os prazos de cada dia.' : 'Organize seu dia e faça mais.'}</p>
          </div>
          <div className="top-r">
            <span className="date"><Ico n="cal" />{dateLabel}</span>
            <button className="icon-btn" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}>
              <Ico n={theme === 'dark' ? 'sun' : 'moon'} key={theme} />
            </button>
          </div>
        </header>

        <section key={page} className="view">
          {page === 'calendar' ? (
            <Calendar tasks={all.tasks} getMeta={get} onToggle={toggle} onEdit={(t) => setModal({ task: t })} onAddDay={(d) => setModal({ date: d })} />
          ) : (
            <>
              <div className="stats">
                <StatCard d={0} label="Total de tarefas" value={total} tone="#14b8a6" icon="list" />
                <StatCard d={1} label="Concluídas" value={done} tone="#22c55e" icon="check" />
                <StatCard d={2} label="Pendentes" value={total - done} tone="#38bdf8" icon="clock" />
                <StatCard d={3} label="Importantes" value={imp} tone="#f472b6" icon="star" />
              </div>

              <Composer sort={sort} onSort={setSort} onAdd={add} />

              <div className="panel">
                <div className="tabs">
                  {TABS.map(([k, l]) => <button key={k} className={`tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{l}</button>)}
                  <label className="find">
                    <Ico n="search" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar tarefas" aria-label="Buscar tarefas" />
                  </label>
                </div>

                {phase === 'loading' && <ul className="rows">{[0, 1, 2, 3].map((n) => <li className="skel" key={n} />)}</ul>}
                {phase === 'error' && (
                  <Empty title="Sem conexão com a API." text={`Confira se o backend está rodando em ${import.meta.env.VITE_API_URL || 'http://localhost:3333'}.`} action="Tentar de novo" onAction={loadAll} />
                )}
                {phase === 'ok' && (shown.length === 0
                  ? <Empty {...empty} onAction={() => setModal({})} />
                  : (
                    <ul className="rows">
                      {shown.map((t, i) => (
                        <TaskRow key={t.id} task={t} meta={get(t.id)} index={i} leaving={leaving === t.id}
                          onToggle={toggle} onStar={star} onEdit={(x) => setModal({ task: x })} onDelete={remove} />
                      ))}
                    </ul>
                  ))}
              </div>
            </>
          )}
        </section>
      </main>

      <button className="fab" onPointerDown={ripple} onClick={() => setModal({})} aria-label="Nova tarefa"><Ico n="plus" style={{ width: 26, height: 26, strokeWidth: 2.4 }} /></button>
      {modal && <TaskModal task={modal.task} meta={modal.task && get(modal.task.id)} defaultDate={modal.date} onClose={() => setModal(null)} onSave={save} />}
      {toast && <div className="toast" role="status">{toast}</div>}
      {boot !== 'gone' && <Splash out={boot === 'out'} />}
    </div>
  );
}
