export function ripple(e) {
  const b = e.currentTarget, r = b.getBoundingClientRect(), s = document.createElement('span');
  const d = Math.max(r.width, r.height);
  s.className = 'ripple';
  s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  b.appendChild(s);
  setTimeout(() => s.remove(), 650);
}
