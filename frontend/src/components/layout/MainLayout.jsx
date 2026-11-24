import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout({
  activeTab,
  onSelectTab,
  globalSearch,
  onGlobalSearchChange,
  onSearchSubmit,
  children,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      {/* Persistent Left Sidebar with Collapse/Expand */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Workspace adjusts margin when sidebar collapses */}
      <div className={`main-viewport ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Topbar
          activeTab={activeTab}
          onOpenMobile={() => setMobileOpen(true)}
          globalSearch={globalSearch}
          onGlobalSearchChange={onGlobalSearchChange}
          onSearchSubmit={onSearchSubmit}
        />
        <main className="content-container">{children}</main>
      </div>
    </div>
  );
}
