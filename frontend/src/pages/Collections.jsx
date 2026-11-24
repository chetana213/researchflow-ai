import { useState } from 'react';
import {
  FolderIcon,
  PlusIcon,
  BookIcon,
  CloseIcon,
  SearchIcon,
  CheckIcon,
} from '../components/icons/Icons';

const COLLECTIONS_DATA = [
  {
    id: 'col-1',
    title: 'Foundational Transformer Architectures',
    description:
      'Seminal papers introducing self-attention, masked language modeling, and autoregressive pre-training.',
    category: 'Deep Learning',
    papersCount: 3,
    updated: 'Updated Nov 20, 2026',
    tags: ['Attention', 'Transformers', 'BERT', 'GPT-3'],
  },
  {
    id: 'col-2',
    title: 'Modern RAG & Vector Retrieval Topology',
    description:
      'Literature analyzing bi-encoders, dense semantic embeddings, hybrid search, and citation grounding.',
    category: 'RAG & Agents',
    papersCount: 2,
    updated: 'Updated Nov 23, 2026',
    tags: ['RAG', 'VectorDB', 'Dense Retrieval'],
  },
  {
    id: 'col-3',
    title: 'Constitutional Alignment & LLM Safety',
    description:
      'Frameworks for automated red-teaming, RLAIF, and self-correction without manual human labeling.',
    category: 'AI Safety',
    papersCount: 1,
    updated: 'Updated Nov 18, 2026',
    tags: ['Safety', 'Alignment', 'Red Teaming'],
  },
  {
    id: 'col-4',
    title: 'Multi-Step Reasoning & Chain-of-Thought',
    description:
      'Techniques exploring intermediate reasoning tokens, self-consistency, and iterative agent workflows.',
    category: 'Reasoning',
    papersCount: 2,
    updated: 'Updated Nov 22, 2026',
    tags: ['Reasoning', 'Chain-of-Thought'],
  },
];

const ALL_CATEGORIES = ['All', ...new Set(COLLECTIONS_DATA.map((c) => c.category))];

export default function Collections({ onExploreCategory }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [createTitle, setCreateTitle] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createConfirmed, setCreateConfirmed] = useState(false);

  const filtered = COLLECTIONS_DATA.filter((col) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      col.title.toLowerCase().includes(q) ||
      col.description.toLowerCase().includes(q) ||
      col.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCat = categoryFilter === 'All' || col.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  function handleCreate(e) {
    e.preventDefault();
    if (!createTitle.trim()) return;
    setCreateConfirmed(true);
    setTimeout(() => {
      setCreateConfirmed(false);
      setShowCreateModal(false);
      setCreateTitle('');
      setCreateDesc('');
    }, 2000);
  }

  function openCreate() {
    setCreateTitle('');
    setCreateDesc('');
    setCreateConfirmed(false);
    setShowCreateModal(true);
  }

  return (
    <div className="collections-page">
      {/* Header */}
      <div className="collections-header-row">
        <div>
          <h2 className="collections-main-title">Curated Research Collections</h2>
          <p className="collections-subtitle">
            Group foundational papers into thematic workspaces for agentic multi-hop retrieval
          </p>
        </div>

        <div className="collections-header-actions">
          <span className="demo-label-pill" title="These are demo collections stored in local state">
            Demo Collections
          </span>
          <button type="button" className="btn-create-collection" onClick={openCreate}>
            <PlusIcon size={16} />
            <span>New Collection</span>
          </button>
        </div>
      </div>

      {/* Search + Category Filter Bar */}
      <div className="collections-filter-bar">
        <div className="col-search-box">
          <SearchIcon size={14} className="col-search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collections by title, tags..."
            className="col-search-input"
            aria-label="Search collections"
          />
          {search && (
            <button
              type="button"
              className="col-search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <CloseIcon size={12} />
            </button>
          )}
        </div>

        <div className="col-category-pills">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`col-cat-pill ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
              aria-pressed={categoryFilter === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results info */}
      <p className="col-results-info">
        Showing <strong>{filtered.length}</strong> of {COLLECTIONS_DATA.length} collections
      </p>

      {/* Collections Grid */}
      {filtered.length > 0 ? (
        <div className="collections-grid">
          {filtered.map((col) => (
            <article key={col.id} className="collection-card">
              <div className="col-card-top">
                <div className="col-icon-wrapper">
                  <FolderIcon size={20} className="col-folder-icon" />
                </div>
                <span className="col-papers-badge">
                  <BookIcon size={12} />
                  {col.papersCount} {col.papersCount === 1 ? 'Paper' : 'Papers'}
                </span>
              </div>

              <h3 className="col-title">{col.title}</h3>
              <p className="col-desc">{col.description}</p>

              <div className="col-tags-row">
                {col.tags.map((t) => (
                  <span key={t} className="col-tag">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="col-card-footer">
                <span className="col-updated">{col.updated}</span>
                <button
                  type="button"
                  className="col-explore-btn"
                  onClick={() => onExploreCategory(col.category)}
                  aria-label={`Browse papers in ${col.category}`}
                >
                  <span>Browse Papers</span>
                  &rarr;
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-collections-state">
          <FolderIcon size={32} className="empty-icon" />
          <h3>No collections match your filters</h3>
          <p>Try adjusting the search term or clearing the category filter.</p>
          <button
            type="button"
            className="empty-reset-btn"
            onClick={() => {
              setSearch('');
              setCategoryFilter('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCreateModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-col-title"
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <FolderIcon size={18} className="modal-icon" />
                <h3 className="modal-title" id="create-col-title">
                  Create Research Collection
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close modal"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <form className="modal-body" onSubmit={handleCreate}>
              <div className="modal-field">
                <label htmlFor="col-title-input" className="field-label">
                  Collection Title <span className="field-required">*</span>
                </label>
                <input
                  id="col-title-input"
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="e.g. Agentic Tool Calling & MCP Protocols"
                  className="field-input"
                  required
                  autoFocus
                />
              </div>

              <div className="modal-field">
                <label htmlFor="col-desc-input" className="field-label">
                  Description{' '}
                  <span className="field-optional">(optional)</span>
                </label>
                <textarea
                  id="col-desc-input"
                  value={createDesc}
                  onChange={(e) => setCreateDesc(e.target.value)}
                  placeholder="Briefly describe what papers belong to this collection..."
                  className="field-textarea"
                  rows={3}
                />
              </div>

              <div className="modal-notice">
                <BookIcon size={13} />
                <span>
                  Collection creation stores data in local React state only. Persistent storage
                  will be added in Phase 3 (MongoDB integration).
                </span>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-submit"
                  disabled={!createTitle.trim() || createConfirmed}
                >
                  {createConfirmed ? (
                    <>
                      <CheckIcon size={14} /> Created!
                    </>
                  ) : (
                    'Create Collection'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
