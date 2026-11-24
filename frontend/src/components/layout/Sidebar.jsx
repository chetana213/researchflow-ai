import {
  LogoIcon,
  OverviewIcon,
  LibraryIcon,
  ResearchIcon,
  CollectionsIcon,
  ReportsIcon,
  SettingsIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from '../icons/Icons';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: OverviewIcon },
  { id: 'library', label: 'My Library', icon: LibraryIcon, badge: '6' },
  { id: 'research', label: 'AI Research', icon: ResearchIcon, highlight: true },
  { id: 'collections', label: 'Collections', icon: CollectionsIcon },
  { id: 'reports', label: 'Reports', icon: ReportsIcon, badge: '4' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div
            className="sidebar-brand"
            onClick={() => onSelectTab('overview')}
            title="ResearchFlow AI Overview"
          >
            <div className="brand-icon-wrapper">
              <LogoIcon size={20} className="brand-icon" />
            </div>
            {!collapsed && (
              <div className="brand-text-group">
                <span className="brand-title">ResearchFlow</span>
                <span className="brand-badge">AI</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Expand Toggle Button */}
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand Sidebar (Ctrl+\\)' : 'Collapse Sidebar (Ctrl+\\)'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRightIcon size={14} /> : <ChevronLeftIcon size={14} />}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            className="sidebar-mobile-close-btn"
            onClick={onCloseMobile}
            aria-label="Close navigation"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Pro Banner (Hidden when collapsed) */}
        {!collapsed && (
          <div className="sidebar-pro-card">
            <div className="pro-card-header">
              <SparklesIcon size={14} className="pro-sparkle" />
              <span className="pro-title">Agentic Workflow</span>
            </div>
            <p className="pro-description">RAG and multi-agent synthesis ready</p>
          </div>
        )}

        {/* Navigation list */}
        <nav className="sidebar-nav">
          {!collapsed && <div className="nav-group-label">WORKSPACE</div>}
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${isActive ? 'active' : ''} ${
                      item.highlight ? 'highlight-link' : ''
                    } ${collapsed ? 'collapsed-link' : ''}`}
                    onClick={() => {
                      onSelectTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    title={collapsed ? item.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={18} className="nav-icon" />
                    {!collapsed && <span className="nav-label">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User profile footer */}
        <div className="sidebar-footer">
          <div className={`user-profile-card ${collapsed ? 'collapsed-profile' : ''}`}>
            <div className="user-avatar" title="Chetana Javvadhi">
              CJ
            </div>
            {!collapsed && (
              <div className="user-info">
                <span className="user-name">Chetana Javvadhi</span>
                <span className="user-role">Research Fellow</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
