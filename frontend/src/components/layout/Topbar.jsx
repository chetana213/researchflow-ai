import { useState, useEffect } from 'react';
import { SearchIcon, BellIcon, SparklesIcon } from '../icons/Icons';
import { checkBackendHealth } from '../../services/api';

const PAGE_METADATA = {
  overview: { title: 'Overview', subtitle: 'Platform dashboard & research synthesis' },
  library: { title: 'Research Library', subtitle: 'Searchable paper repositories & metadata' },
  research: { title: 'AI Research Workspace', subtitle: 'Document-grounded question answering & reasoning' },
  collections: { title: 'Collections', subtitle: 'Curated literature sets & topic clusters' },
  reports: { title: 'Research Reports', subtitle: 'Multi-document syntheses & executive summaries' },
  settings: { title: 'Settings', subtitle: 'API connection, model configurations & system preferences' },
};

export default function Topbar({
  activeTab,
  onOpenMobile,
  globalSearch,
  onGlobalSearchChange,
  onSearchSubmit,
}) {
  const [backendHealth, setBackendHealth] = useState({ status: 'checking' });
  const meta = PAGE_METADATA[activeTab] || PAGE_METADATA.overview;

  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((health) => {
      if (isMounted) setBackendHealth(health);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const isOnline = backendHealth.status === 'healthy';

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Mobile menu hamburger */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onOpenMobile}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        {/* Page breadcrumb */}
        <div className="page-heading-group">
          <h1 className="page-title">{meta.title}</h1>
          <span className="page-subtitle">{meta.subtitle}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Global Quick Search */}
        <div className="topbar-search">
          <SearchIcon size={15} className="topbar-search-icon" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onSearchSubmit) onSearchSubmit();
            }}
            placeholder="Search papers, topics, authors..."
            className="topbar-search-input"
          />
          <kbd className="search-shortcut">⌘K</kbd>
        </div>

        {/* Backend health pill */}
        <div
          className={`backend-status-pill ${isOnline ? 'online' : 'checking'}`}
          title={isOnline ? 'FastAPI Backend Online (127.0.0.1:8000)' : 'Checking Backend Status'}
        >
          <span className="status-dot" />
          <span className="status-label">
            {isOnline ? 'Backend Online' : 'Connecting...'}
          </span>
        </div>

        {/* Action icons */}
        <div className="topbar-actions">
          <button
            type="button"
            className="topbar-icon-btn"
            title="Notifications"
            aria-label="Notifications"
          >
            <BellIcon size={17} />
          </button>
        </div>

        {/* Avatar */}
        <div className="topbar-avatar" title="Chetana Javvadhi">
          CJ
        </div>
      </div>
    </header>
  );
}
