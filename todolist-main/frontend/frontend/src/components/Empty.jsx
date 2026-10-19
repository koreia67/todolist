import blocks from '../assets/blocks.svg';

export default function Empty({ title, text, action, onAction }) {
  return (
    <div className="empty">
      <img className="art" src={blocks} alt="" />
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {action && <button className="btn-pri" onClick={onAction}>{action}</button>}
    </div>
  );
}
