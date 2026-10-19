export default function Moon({ done, total }) {
  const p = total ? done / total : 0;
  return (
    <svg className="moon" viewBox="0 0 64 64" role="img" aria-label={`${done} de ${total} concluídas`}>
      <defs>
        <radialGradient id="lit" cx="35%" cy="30%">
          <stop offset="0" stopColor="#fff7e6" />
          <stop offset="1" stopColor="#ffd2a0" />
        </radialGradient>
        <mask id="phase">
          <rect width="64" height="64" fill="black" />
          <circle cx="32" cy="32" r="26" fill="white" />
          <circle className="shade" cx="32" cy="32" r="26" fill="black" style={{ transform: `translateX(${p * 58}px)` }} />
        </mask>
      </defs>
      <circle cx="32" cy="32" r="26" className="moon-base" />
      <circle cx="32" cy="32" r="26" fill="url(#lit)" mask="url(#phase)" />
    </svg>
  );
}
