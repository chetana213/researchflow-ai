import { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Research from './pages/Research';
import Collections from './pages/Collections';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [globalSearch, setGlobalSearch] = useState('');
  const [activeDocId, setActiveDocId] = useState('doc_101');
  const [activeDocTitle, setActiveDocTitle] = useState('Attention Is All You Need');
  const [libraryCategory, setLibraryCategory] = useState('All');

  // Navigate to AI Research with a specific document selected
  const handleAskAI = (docId, title) => {
    setActiveDocId(docId || 'doc_101');
    setActiveDocTitle(title || '');
    setActiveTab('research');
  };

  // Navigate to Library with a specific category pre-filtered from Collections
  const handleExploreCategory = (category) => {
    setLibraryCategory(category || 'All');
    setActiveTab('library');
  };

  // When Enter is pressed in topbar search, jump to library
  const handleSearchSubmit = () => {
    if (globalSearch.trim()) {
      setActiveTab('library');
    }
  };

  return (
    <MainLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      globalSearch={globalSearch}
      onGlobalSearchChange={setGlobalSearch}
      onSearchSubmit={handleSearchSubmit}
    >
      {activeTab === 'overview' && (
        <Dashboard onNavigate={setActiveTab} onAskAI={handleAskAI} />
      )}
      {activeTab === 'library' && (
        <Library
          onAskAI={handleAskAI}
          externalSearch={globalSearch}
          initialCategory={libraryCategory}
        />
      )}
      {activeTab === 'research' && (
        <Research prefilledDocId={activeDocId} prefilledTitle={activeDocTitle} />
      )}
      {activeTab === 'collections' && (
        <Collections onExploreCategory={handleExploreCategory} />
      )}
      {activeTab === 'reports' && <Reports />}
      {activeTab === 'settings' && <Settings />}
    </MainLayout>
  );
}
