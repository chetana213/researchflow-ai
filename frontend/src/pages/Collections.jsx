import { useState } from 'react';
import {
  FolderIcon,
  PlusIcon,
  SparklesIcon,
  BookIcon,
  CloseIcon,
} from '../components/icons/Icons';

const COLLECTIONS_DATA = [
  {
    id: 'col-1',
    title: 'Foundational Transformer Architectures',
    description: 'Seminal papers introducing self-attention, masked language modeling, and autoregressive pre-training.',
    category: 'Deep Learning',
    papersCount: 3,
    updated: 'Updated Nov 20, 2026',
    tags: ['Attention', 'Transformers', 'BERT', 'GPT-3'],
  },
  {
    id: 'col-2',
    title: 'Modern RAG & Vector Retrieval Topology',
    description: 'Literature analyzing bi-encoders, dense semantic embeddings, hybrid search, and citation grounding.',
    category: 'RAG & Agents',
    papersCount: 2,
    updated: 'Updated Nov 23, 2026',
    tags: ['RAG', 'VectorDB', 'Dense Retrieval'],
  },
  {
    id: 'col-3',
    title: 'Constitutional Alignment & LLM Safety',
    description: 'Frameworks for automated red-teaming, RLAIF, and self-correction without manual human labeling.',
    category: 'AI Safety',
    papersCount: 1,
    updated: 'Updated Nov 18, 2026',
    tags: ['Safety', 'Alignment', 'Red Teaming'],
  },
  {
    id: 'col-4',
    title: 'Multi-Step Reasoning & Chain-of-Thought',
    description: 'Techniques exploring intermediate reasoning tokens, self-consistency, and iterative agent workflows.',
    category: 'Reasoning',
    papersCount: 2,
    updated: 'Updated Nov 22, 2026',
    tags: ['Reasoning', 'Chain-of-Thought'],
  },
];

export default function Collections({ onExploreCategory }) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="collections-page">
      <div className="collections-header-row">
        <div>
          <h2 className="collections-main-title">Curated Research Collections</h2>
          <p className="collections-subtitle">
            Group foundational papers into thematic workspaces for agentic multi-hop retrieval
          </p>
        </div>

        <button
          type="button"
          className="btn-create-collection"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusIcon size={16} />
          <span>New Collection</span>
        </button>
      </div>

      <div className="collections-grid">
        {COLLECTIONS_DATA.map((col) => (
          <article key={col.id} className="collection-card">
            <div className="col-card-top">
              <div className="col-icon-wrapper">
                <FolderIcon size={20} className="col-folder-icon" />
              </div>
              <span className="col-papers-badge">
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
              >
                <span>Browse Papers</span>
                &rarr;
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Create Collection Modal Placeholder */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <FolderIcon size={18} className="modal-icon" />
                <h3 className="modal-title">Create Research Collection</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-field">
                <label className="field-label">Collection Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Agentic Tool Calling & MCP Protocols"
                  className="field-input"
                />
              </div>

              <div className="modal-field">
                <label className="field-label">Description:</label>
                <textarea
                  rows={3}
                  placeholder="Thematic summary of the included literature..."
                  className="field-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="modal-notice">
                <SparklesIcon size={14} className="notice-icon" />
                <span>
                  Collections persist in browser state and will link to MongoDB collections in upcoming phases.
                </span>
              </div>
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
                type="button"
                className="btn-modal-submit"
                onClick={() => {
                  alert('Collection created in local session!');
                  setShowCreateModal(false);
                }}
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
