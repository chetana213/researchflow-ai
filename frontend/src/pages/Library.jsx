import { useState, useEffect } from 'react';
import DocumentGrid from '../components/documents/DocumentGrid';
import { DEMO_PAPERS } from '../data/demoData';
import { fetchDocuments } from '../services/api';
import { UploadIcon, SparklesIcon, CheckIcon, CloseIcon } from '../components/icons/Icons';

const CATEGORIES = ['All', 'Deep Learning', 'NLP', 'RAG & Agents', 'LLMs', 'Reasoning', 'AI Safety'];

export default function Library({ onAskAI, externalSearch = '', initialCategory = 'All' }) {
  const [searchQuery, setSearchQuery] = useState(externalSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [backendMeta, setBackendMeta] = useState(null);
  const [backendLoading, setBackendLoading] = useState(true);

  // Sync with external search if topbar triggers it
  useEffect(() => {
    if (externalSearch !== undefined) setSearchQuery(externalSearch);
  }, [externalSearch]);

  // Sync with initialCategory if navigated from Collections
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Connect to actual FastAPI GET /documents endpoint to demonstrate live backend integration
  useEffect(() => {
    let isMounted = true;
    setBackendLoading(true);
    fetchDocuments('all', 1)
      .then((data) => {
        if (isMounted) {
          setBackendMeta(data);
          setBackendLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setBackendMeta({ error: err.message });
          setBackendLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter papers
  const filteredPapers = DEMO_PAPERS.filter((paper) => {
    const matchesCategory =
      selectedCategory === 'All' || paper.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      paper.title.toLowerCase().includes(q) ||
      paper.authors.toLowerCase().includes(q) ||
      (paper.tags && paper.tags.some((t) => t.toLowerCase().includes(q)));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="library-page">
      {/* Header Bar */}
      <div className="library-header-row">
        <div>
          <h2 className="library-main-title">Research Document Library</h2>
          <p className="library-subtitle">
            Curated foundation papers and indexed corpus available for agentic retrieval
          </p>
        </div>

        <button
          type="button"
          className="btn-upload-paper"
          onClick={() => setShowUploadModal(true)}
        >
          <UploadIcon size={16} />
          <span>Ingest Document</span>
        </button>
      </div>

      {/* Backend Integration Status Banner */}
      <div className="backend-meta-banner">
        <div className="meta-banner-left">
          <span className="meta-pulse" />
          <span className="meta-label">FastAPI Endpoint Connected:</span>
          <code>GET /documents</code>
        </div>
        <div className="meta-banner-right">
          {backendLoading ? (
            <span className="meta-status">Querying backend...</span>
          ) : backendMeta?.error ? (
            <span className="meta-status error">Backend offline: {backendMeta.error}</span>
          ) : (
            <span className="meta-status success">
              Status: 200 OK &bull; Response: &ldquo;{backendMeta?.message}&rdquo; (Page {backendMeta?.page}, Category: {backendMeta?.category})
            </span>
          )}
        </div>
      </div>

      {/* Document Grid with Filters & Sort */}
      <DocumentGrid
        documents={filteredPapers}
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        onAskAI={onAskAI}
      />

      {/* Upload Document Modal Placeholder */}
      {showUploadModal && (
        <div className="modal-backdrop" onClick={() => setShowUploadModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <UploadIcon size={18} className="modal-icon" />
                <h3 className="modal-title">Ingest Research Document</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowUploadModal(false)}
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-instruction">
                Upload PDFs, Markdown notes, or provide an arXiv ID to extract text, generate chunk embeddings, and index into ChromaDB.
              </p>

              <div className="upload-dropzone">
                <UploadIcon size={32} className="dropzone-icon" />
                <span className="dropzone-text">
                  Drag and drop research papers here, or <strong>browse files</strong>
                </span>
                <span className="dropzone-hint">
                  Supports PDF, EPUB, LaTeX, Markdown (up to 50MB)
                </span>
              </div>

              <div className="modal-field">
                <label className="field-label">arXiv URL or ID (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. 1706.03762 or https://arxiv.org/abs/1706.03762"
                  className="field-input"
                />
              </div>

              <div className="modal-notice">
                <SparklesIcon size={14} className="notice-icon" />
                <span>
                  Notice: Document upload will be connected to Celery background workers and ChromaDB in Phase 3.
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-submit"
                onClick={() => {
                  alert("Document ingestion pipeline will be activated in upcoming Phase 3.");
                  setShowUploadModal(false);
                }}
              >
                Start Ingestion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
