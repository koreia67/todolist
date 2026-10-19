import { useCallback, useState } from 'react';

const KEY = 'gustavo:meta';
export const LISTS = [
  { name: 'Trabalho', color: '#14b8a6' },
  { name: 'Estudos', color: '#22c55e' },
  { name: 'Pessoal', color: '#f472b6' },
  { name: 'Projetos', color: '#fb923c' },
];
export const listColor = (n) => LISTS.find((l) => l.name === n)?.color || '#14b8a6';

const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };

export function useMeta() {
  const [meta, setMeta] = useState(read);
  const patch = useCallback((id, p) => setMeta((m) => {
    const next = { ...m, [id]: { ...m[id], ...p } };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    return next;
  }), []);
  const get = (id) => ({ important: false, list: 'Pessoal', ...meta[id] });
  return { meta, get, patch };
}
