import { ArrowRightIcon } from '../icons/Icons';

export default function StatCard({ label, value, change, isPositive, sublabel, onClick }) {
  return (
    <div
      className={`stat-card${onClick ? ' stat-card-clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
      aria-label={onClick ? `${label}: ${value}. Click to view.` : undefined}
    >
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        {change && (
          <span className={`stat-delta ${isPositive ? 'positive' : 'neutral'}`}>
            {change}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {sublabel && <div className="stat-sublabel">{sublabel}</div>}
      {onClick && (
        <div className="stat-action">
          <ArrowRightIcon size={12} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
