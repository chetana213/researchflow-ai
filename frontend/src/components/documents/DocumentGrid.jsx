import { useState } from 'react';
import DocumentCard from './DocumentCard';
import { SearchIcon, GridIcon, ListIcon, CloseIcon } from '../icons/Icons';

export default function DocumentGrid({
  documents = [],
  categories = [],
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onClearSearch,
  onAskAI,
}) {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');

  // Sorting comparator
  const sortedDocuments = [...documents].sort((a, b) => {
    if (sortBy === 'year') return (b.year || 0) - (a.year || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'citations') {
      const citA = parseInt(String(a.citations || '0').replace(/,/g, ''), 10);
      const citB = parseInt(String(b.citations || '0').replace(/,/g, ''), 10);
      return citB - citA;
    }
    return 0;
  });

  return (
    <div className="document-grid-wrapper">
      {/* Search & Filter Control Bar */}
      <div className="grid-controls-bar">
        {/* Search input with clear button */}
        <div className="grid-search-container">
          <SearchIcon size={16} className="search-input-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search papers by title, author, or tags..."
            className="grid-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={onClearSearch}
              title="Clear search"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </div>

        {/* View mode & Sort controls */}
        <div className="grid-actions-container">
          <div className="sort-select-wrapper">
            <label htmlFor="sort-select" className="control-label">
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured First</option>
              <option value="year">Publication Year</option>
              <option value="citations">Most Cited</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>

          <div className="view-toggle-group">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <GridIcon size={16} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="category-pills-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Document Listing or Empty State */}
      {sortedDocuments.length > 0 ? (
        <div className={`documents-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
          {sortedDocuments.map((doc) => (
            <DocumentCard
              key={doc.id || doc.documentId || doc.title}
              documentId={doc.documentId || doc.id}
              title={doc.title}
              authors={doc.authors || doc.author}
              category={doc.category}
              year={doc.year}
              citations={doc.citations}
              readTime={doc.readTime}
              abstract={doc.abstract}
              tags={doc.tags}
              viewMode={viewMode}
              onAskAI={onAskAI}
            />
          ))}
        </div>
      ) : (
        <div className="empty-search-state">
          <div className="empty-icon-bubble">
            <SearchIcon size={24} />
          </div>
          <h3 className="empty-title">No matching research papers</h3>
          <p className="empty-description">
            We couldn't find any papers matching &ldquo;{searchQuery}&rdquo; in category &ldquo;{selectedCategory}&rdquo;.
          </p>
          <button
            type="button"
            className="empty-reset-btn"
            onClick={() => {
              onClearSearch();
              onSelectCategory('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
