import StatCard from '../components/dashboard/StatCard';
import QuickActions from '../components/dashboard/QuickActions';
import DocumentCard from '../components/documents/DocumentCard';
import { DEMO_STATS, DEMO_PAPERS, DEMO_ACTIVITIES } from '../data/demoData';
import { SparklesIcon, ClockIcon } from '../components/icons/Icons';

export default function Dashboard({ onNavigate, onAskAI }) {
  const recentPapers = DEMO_PAPERS.slice(0, 3);

  const handleQuickAction = (action) => {
    if (action === 'research')    onNavigate('research');
    else if (action === 'library')     onNavigate('library');
    else if (action === 'collections') onNavigate('collections');
    else if (action === 'upload')      onNavigate('library');   // Opens library → upload modal
  };

  return (
    <div className="dashboard-page">
      {/* ── Welcome Banner ── */}
      <section className="welcome-banner" aria-labelledby="welcome-heading">
        <div className="welcome-content">
          <div className="welcome-badge">
            <SparklesIcon size={13} className="sparkle-gold" aria-hidden="true" />
            <span>AI-Powered Knowledge &amp; Research Platform</span>
          </div>
          <h2 className="welcome-heading" id="welcome-heading">
            Welcome back, Chetana
          </h2>
          <p className="welcome-subtext">
            Synthesize academic literature, retrieve vector-grounded citations, and collaborate
            with autonomous AI agents across your research corpus.
          </p>
        </div>

        <div className="welcome-actions">
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => onNavigate('research')}
            aria-label="Start AI Research"
          >
            <SparklesIcon size={15} aria-hidden="true" />
            <span>Start AI Research</span>
          </button>
          <button
            type="button"
            className="btn-secondary-action"
            onClick={() => onNavigate('library')}
            aria-label="Browse Library"
          >
            Browse Library
          </button>
        </div>
      </section>

      {/* ── Metrics Row ── */}
      <section className="dashboard-section" aria-labelledby="metrics-heading">
        <div className="section-title-row">
          <h3 className="section-heading" id="metrics-heading">
            Platform Intelligence Metrics
          </h3>
          <span className="demo-data-tag" title="These numbers are demonstration data only">
            Demo Telemetry
          </span>
        </div>
        <div className="stats-grid" role="list" aria-label="Platform statistics">
          {DEMO_STATS.map((stat) => (
            <div key={stat.id} role="listitem">
              <StatCard
                {...stat}
                onClick={stat.id === 'stat-docs' ? () => onNavigate('library') : undefined}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Actions ── */}
      <section className="dashboard-section" aria-labelledby="actions-heading">
        <div className="section-title-row">
          <h3 className="section-heading" id="actions-heading">Quick Actions</h3>
        </div>
        <QuickActions onAction={handleQuickAction} />
      </section>

      {/* ── Dual Panel: Papers + Activity ── */}
      <div className="dashboard-dual-grid">
        {/* Recently Indexed Papers */}
        <section className="dashboard-subpanel" aria-labelledby="recent-papers-heading">
          <div className="subpanel-header">
            <div>
              <h3 className="section-heading" id="recent-papers-heading">
                Recently Indexed Papers
              </h3>
              <p className="subpanel-sub">
                Foundation literature available for semantic retrieval
              </p>
            </div>
            <button
              type="button"
              className="link-button"
              onClick={() => onNavigate('library')}
              aria-label="View all 6 papers in library"
            >
              View All (6) →
            </button>
          </div>

          <div className="dashboard-papers-list" role="list" aria-label="Recent papers">
            {recentPapers.map((paper) => (
              <div key={paper.id} role="listitem">
                <DocumentCard
                  documentId={paper.documentId}
                  title={paper.title}
                  authors={paper.authors}
                  category={paper.category}
                  year={paper.year}
                  citations={paper.citations}
                  readTime={paper.readTime}
                  tags={paper.tags}
                  viewMode="grid"
                  onAskAI={onAskAI}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Activity Feed */}
        <section className="dashboard-subpanel" aria-labelledby="activity-heading">
          <div className="subpanel-header">
            <div>
              <h3 className="section-heading" id="activity-heading">
                Research Activity Feed
              </h3>
              <p className="subpanel-sub">
                Recent vector queries &amp; document processing events
              </p>
            </div>
            <span
              className="demo-data-tag"
              title="Simulated activity log — real events will appear after MongoDB integration"
            >
              Simulated Log
            </span>
          </div>

          <div className="activity-timeline" role="log" aria-label="Activity timeline" aria-live="polite">
            {DEMO_ACTIVITIES.map((act) => (
              <div key={act.id} className="timeline-item">
                <div className="timeline-marker" aria-hidden="true" />
                <div className="timeline-content">
                  <div className="timeline-title">{act.title}</div>
                  <div className="timeline-meta">
                    <span className="timeline-doc">{act.document}</span>
                    <span className="timeline-dot" aria-hidden="true">&bull;</span>
                    <span className="timeline-time">
                      <ClockIcon size={11} aria-hidden="true" />
                      {act.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
