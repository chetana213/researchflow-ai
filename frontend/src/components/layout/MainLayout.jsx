import { useState, useEffect } from 'react';
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
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [collapsed,  setCollapsed]    = useState(false);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut: Ctrl+\ to toggle collapse
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((p) => !p)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main content — margin shifts when sidebar collapses */}
      <div className={`main-viewport${collapsed ? ' sidebar-collapsed' : ''}`}>
        <Topbar
          activeTab={activeTab}
          onOpenMobile={() => setMobileOpen(true)}
          globalSearch={globalSearch}
          onGlobalSearchChange={onGlobalSearchChange}
          onSearchSubmit={onSearchSubmit}
        />
        <main className="content-container" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
