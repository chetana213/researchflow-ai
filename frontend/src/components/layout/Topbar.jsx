import { useState, useEffect } from 'react';
import { SearchIcon, BellIcon, SparklesIcon, CloseIcon } from '../icons/Icons';
import { checkBackendHealth } from '../../services/api';

const PAGE_METADATA = {
  overview:    { title: 'Overview',               subtitle: 'Platform dashboard & research synthesis' },
  library:     { title: 'Research Library',       subtitle: 'Searchable paper repositories & metadata' },
  research:    { title: 'AI Research Workspace',  subtitle: 'Document-grounded question answering & reasoning' },
  collections: { title: 'Collections',            subtitle: 'Curated literature sets & topic clusters' },
  reports:     { title: 'Research Reports',       subtitle: 'Multi-document syntheses & executive summaries' },
  settings:    { title: 'Settings',               subtitle: 'API connection, model configurations & preferences' },
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
    return () => { isMounted = false; };
  }, []);

  const isOnline = backendHealth.status === 'healthy';

  return (
    <header className="topbar" role="banner">
      <div className="topbar-left">
        {/* Mobile hamburger */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
          aria-expanded={false}
        >
          <span className="hamburger-line" aria-hidden="true" />
          <span className="hamburger-line" aria-hidden="true" />
          <span className="hamburger-line" aria-hidden="true" />
        </button>

        {/* Page breadcrumb */}
        <div className="page-heading-group">
          <h1 className="page-title">{meta.title}</h1>
          <span className="page-subtitle">{meta.subtitle}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Global Quick Search */}
        <div className="topbar-search" role="search">
          <SearchIcon size={15} className="topbar-search-icon" aria-hidden="true" />
          <input
            type="search"
            value={globalSearch}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onSearchSubmit) onSearchSubmit();
            }}
            placeholder="Search papers, topics, authors..."
            className="topbar-search-input"
            aria-label="Global search"
          />
          {globalSearch && (
            <button
              type="button"
              className="topbar-search-clear"
              onClick={() => onGlobalSearchChange('')}
              aria-label="Clear search"
            >
              <CloseIcon size={12} />
            </button>
          )}
          <kbd className="search-shortcut" aria-label="Keyboard shortcut: Command K">⌘K</kbd>
        </div>

        {/* Backend health pill */}
        <div
          className={`backend-status-pill ${isOnline ? 'online' : 'checking'}`}
          title={isOnline ? 'FastAPI Backend Online (127.0.0.1:8000)' : 'Checking backend status…'}
          aria-label={isOnline ? 'Backend online' : 'Checking backend connection'}
        >
          <span className="status-dot" aria-hidden="true" />
          <span className="status-label">
            {isOnline ? 'Backend Online' : 'Connecting…'}
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
            <BellIcon size={17} aria-hidden="true" />
          </button>
        </div>

        {/* Avatar */}
        <div
          className="topbar-avatar"
          title="Chetana Javvadhi"
          aria-label="User: Chetana Javvadhi"
        >
          CJ
        </div>
      </div>
    </header>
  );
}
