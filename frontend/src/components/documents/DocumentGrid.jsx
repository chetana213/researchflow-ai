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
  const [sortBy,   setSortBy  ] = useState('featured');

  // Sorting
  const sortedDocuments = [...documents].sort((a, b) => {
    if (sortBy === 'year')      return (b.year || 0) - (a.year || 0);
    if (sortBy === 'title')     return a.title.localeCompare(b.title);
    if (sortBy === 'citations') {
      const citA = parseInt(String(a.citations || '0').replace(/,/g, ''), 10);
      const citB = parseInt(String(b.citations || '0').replace(/,/g, ''), 10);
      return citB - citA;
    }
    return 0; // featured — preserve natural order
  });

  const hasFilters = searchQuery || (selectedCategory && selectedCategory !== 'All');

  return (
    <div className="document-grid-wrapper">
      {/* ── Control Bar ── */}
      <div className="grid-controls-bar" role="toolbar" aria-label="Document filtering and display controls">
        {/* Search */}
        <div className="grid-search-container" role="search">
          <SearchIcon size={16} className="search-input-icon" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search papers by title, author, or tags…"
            className="grid-search-input"
            aria-label="Search documents"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={onClearSearch}
              title="Clear search"
              aria-label="Clear search"
            >
              <CloseIcon size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Sort + View toggle */}
        <div className="grid-actions-container">
          <div className="sort-select-wrapper">
            <label htmlFor="sort-select" className="control-label">Sort:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              aria-label="Sort documents"
            >
              <option value="featured">Featured First</option>
              <option value="year">Publication Year</option>
              <option value="citations">Most Cited</option>
              <option value="title">Alphabetical (A–Z)</option>
            </select>
          </div>

          <div className="view-toggle-group" role="group" aria-label="View mode">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <GridIcon size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <ListIcon size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Category Filters ── */}
      {categories.length > 0 && (
        <div className="category-pills-row" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ── Results ── */}
      {sortedDocuments.length > 0 ? (
        <>
          <div className="grid-results-info" aria-live="polite" aria-atomic="true">
            Showing <strong>{sortedDocuments.length}</strong> paper{sortedDocuments.length !== 1 ? 's' : ''}
            {selectedCategory && selectedCategory !== 'All' && (
              <> in <strong>{selectedCategory}</strong></>
            )}
          </div>
          <div
            className={`documents-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}
            role="list"
            aria-label={`Documents in ${viewMode} view`}
          >
            {sortedDocuments.map((doc) => (
              <div key={doc.documentId || doc.id || doc.title} role="listitem">
                <DocumentCard
                  documentId={doc.documentId || doc.id}
                  title={doc.title}
                  authors={doc.authors || doc.author}
                  category={doc.category}
                  year={doc.year}
                  citations={doc.citations}
                  readTime={doc.readTime}
                  abstract={doc.abstract || doc.description}
                  tags={doc.tags}
                  viewMode={viewMode}
                  onAskAI={onAskAI}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-search-state" role="status" aria-live="polite">
          <div className="empty-icon-bubble" aria-hidden="true">
            <SearchIcon size={24} />
          </div>
          <h3 className="empty-title">No matching research papers</h3>
          <p className="empty-description">
            {hasFilters
              ? <>No papers match your current filters. Try broadening your search or changing the category.</>
              : <>Your library has no documents yet. Add papers using the Ingest Document button.</>}
          </p>
          {hasFilters && (
            <button
              type="button"
              className="empty-reset-btn"
              onClick={() => {
                if (onClearSearch) onClearSearch();
                if (onSelectCategory) onSelectCategory('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
