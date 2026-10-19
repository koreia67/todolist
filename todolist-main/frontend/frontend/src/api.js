const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333';

async function req(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Não foi possível concluir. Tente de novo.');
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  list: (search, status) => req(`/api/tasks?search=${encodeURIComponent(search)}&status=${status}`),
  create: (body) => req('/api/tasks', { method: 'POST', body }),
  update: (id, body) => req(`/api/tasks/${id}`, { method: 'PATCH', body }),
  remove: (id) => req(`/api/tasks/${id}`, { method: 'DELETE' }),
};
