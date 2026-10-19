export const fmt = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const dayOf = (v) => (v ? String(v).slice(0, 10) : '');
export const todayStr = () => fmt(new Date());

export function dueLabel(day) {
  const add = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return fmt(d); };
  if (day === add(0)) return 'Hoje';
  if (day === add(-1)) return 'Ontem';
  if (day === add(1)) return 'Amanhã';
  const s = new Date(day + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '');
  return s[0].toUpperCase() + s.slice(1);
}
