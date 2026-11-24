export default function StatCard({ label, value, change, isPositive, sublabel }) {
  return (
    <div className="stat-card">
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
    </div>
  );
}
