import StatCard from '../components/dashboard/StatCard';
import QuickActions from '../components/dashboard/QuickActions';
import DocumentCard from '../components/documents/DocumentCard';
import { DEMO_STATS, DEMO_PAPERS, DEMO_ACTIVITIES } from '../data/demoData';
import { SparklesIcon, ClockIcon, ArrowRightIcon } from '../components/icons/Icons';

export default function Dashboard({ onNavigate, onAskAI }) {
  const recentPapers = DEMO_PAPERS.slice(0, 3);

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-badge">
            <SparklesIcon size={13} className="sparkle-gold" />
            <span>AI-Powered Knowledge & Research Platform</span>
          </div>
          <h2 className="welcome-heading">Welcome back, Chetana</h2>
          <p className="welcome-subtext">
            Synthesize academic literature, retrieve vector-grounded citations, and collaborate with autonomous AI agents across your research corpus.
          </p>
        </div>

        <div className="welcome-actions">
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => onNavigate('research')}
          >
            <SparklesIcon size={15} />
            <span>Start AI Research</span>
          </button>
          <button
            type="button"
            className="btn-secondary-action"
            onClick={() => onNavigate('library')}
          >
            <span>Browse Library</span>
          </button>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="dashboard-section">
        <div className="section-title-row">
          <h3 className="section-heading">Platform Intelligence Metrics</h3>
          <span className="demo-data-tag">Demo Telemetry</span>
        </div>
        <div className="stats-grid">
          {DEMO_STATS.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="dashboard-section">
        <div className="section-title-row">
          <h3 className="section-heading">Quick Actions</h3>
        </div>
        <QuickActions
          onAction={(action) => {
            if (action === 'research') onNavigate('research');
            else if (action === 'library') onNavigate('library');
            else if (action === 'upload') onNavigate('library');
          }}
        />
      </section>

      {/* Two Column Layout: Recent Papers & Activity Feed */}
      <div className="dashboard-dual-grid">
        {/* Recently Ingested / Viewed Papers */}
        <section className="dashboard-subpanel">
          <div className="subpanel-header">
            <div>
              <h3 className="section-heading">Recently Indexed Papers</h3>
              <p className="subpanel-sub">Foundation literature available for semantic retrieval</p>
            </div>
            <button
              type="button"
              className="link-button"
              onClick={() => onNavigate('library')}
            >
              View All (6) &rarr;
            </button>
          </div>

          <div className="dashboard-papers-list">
            {recentPapers.map((paper) => (
              <DocumentCard
                key={paper.id}
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
            ))}
          </div>
        </section>

        {/* Activity Feed */}
        <section className="dashboard-subpanel">
          <div className="subpanel-header">
            <div>
              <h3 className="section-heading">Research Activity Feed</h3>
              <p className="subpanel-sub">Recent vector queries & document processing events</p>
            </div>
            <span className="demo-data-tag">Simulated Log</span>
          </div>

          <div className="activity-timeline">
            {DEMO_ACTIVITIES.map((act) => (
              <div key={act.id} className="timeline-item">
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <div className="timeline-title">{act.title}</div>
                  <div className="timeline-meta">
                    <span className="timeline-doc">{act.document}</span>
                    <span className="timeline-dot">&bull;</span>
                    <span className="timeline-time">
                      <ClockIcon size={11} />
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
