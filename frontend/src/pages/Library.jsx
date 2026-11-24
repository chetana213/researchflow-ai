import { useState, useEffect } from 'react';
import DocumentGrid from '../components/documents/DocumentGrid';
import { fetchDocuments } from '../services/api';
import { UploadIcon, SparklesIcon, CloseIcon, AlertIcon } from '../components/icons/Icons';

const KNOWN_CATEGORIES = [
  'All',
  'Deep Learning',
  'NLP',
  'RAG & Agents',
  'LLMs',
  'Reasoning',
  'AI Safety',
];

/**
 * Normalize a raw document object returned by GET /documents into the
 * shape expected by DocumentCard and DocumentGrid.
 *
 * Backend fields (from MongoDB via FastAPI):
 *   document_id, title, author, category, file_name, status, description, source
 *
 * DocumentCard props:
 *   documentId, title, authors, category, abstract, tags, year, citations, readTime
 */
function normalizeDocument(raw) {
  const docId = raw.document_id || raw.documentId || raw._id || '';
  return {
    id:          docId,
    documentId:  docId,
    title:       raw.title || '(Untitled)',
    authors:     raw.author || raw.authors || '',
    category:    raw.category || 'General',
    abstract:    raw.description || raw.abstract || '',
    // Do not fabricate publication years, citation counts, or tags
    year:        raw.year ?? undefined,
    citations:   raw.citations ?? undefined,
    readTime:    raw.readTime ?? undefined,
    tags:        Array.isArray(raw.tags) ? raw.tags : [],
    fileName:    raw.file_name,
    status:      raw.status,
    source:      raw.source,
  };
}

/**
 * Combine default categories with any dynamic categories present in the database documents.
 */
function buildCategories(docs) {
  const docCats = docs.map((d) => d.category).filter(Boolean);
  return Array.from(new Set([...KNOWN_CATEGORIES, ...docCats]));
}

export default function Library({ onAskAI, externalSearch = '', initialCategory = 'All' }) {
  // ── State for MongoDB-backed FastAPI documents ──────────────────────────────
  const [documents,        setDocuments       ] = useState([]);
  const [apiLoading,       setApiLoading      ] = useState(true);
  const [apiError,         setApiError        ] = useState(null);
  const [apiMeta,          setApiMeta         ] = useState(null);

  // ── UI Filter & Modal State ────────────────────────────────────────────────
  const [searchQuery,      setSearchQuery     ] = useState(externalSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showUploadModal,  setShowUploadModal ] = useState(false);

  // Sync external search from topbar
  useEffect(() => {
    if (externalSearch !== undefined) setSearchQuery(externalSearch);
  }, [externalSearch]);

  // Sync category from Collections "Browse Papers" links
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Fetch real documents from FastAPI backend
  useEffect(() => {
    let isMounted = true;
    setApiLoading(true);
    setApiError(null);

    fetchDocuments('all', 1)
      .then((data) => {
        if (!isMounted) return;
        const rawDocs = Array.isArray(data.documents) ? data.documents : [];
        setDocuments(rawDocs.map(normalizeDocument));
        setApiMeta(data);
        setApiLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setApiError(err.message || 'Failed to reach backend');
        setApiLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Derived category list (standard + dynamic categories from MongoDB)
  const categories = buildCategories(documents);

  // Search against title, author, description (abstract), and tags
  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'All' || doc.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (doc.title && doc.title.toLowerCase().includes(q)) ||
      (doc.authors && doc.authors.toLowerCase().includes(q)) ||
      (doc.abstract && doc.abstract.toLowerCase().includes(q)) ||
      (Array.isArray(doc.tags) &&
        doc.tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q)));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="library-page">
      {/* Header */}
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
          aria-label="Ingest a new research document"
        >
          <UploadIcon size={16} aria-hidden="true" />
          <span>Ingest Document</span>
        </button>
      </div>

      {/* Backend Integration Banner */}
      <div
        className="backend-meta-banner"
        role="status"
        aria-live="polite"
        aria-label="Backend connection status"
      >
        <div className="meta-banner-left">
          <span
            className={`meta-pulse ${apiError ? 'error' : apiLoading ? '' : 'success'}`}
            aria-hidden="true"
          />
          <span className="meta-label">FastAPI Endpoint:</span>
          <code>GET /documents</code>
        </div>
        <div className="meta-banner-right">
          {apiLoading ? (
            <span className="meta-status">Querying backend…</span>
          ) : apiError ? (
            <span className="meta-status error">
              <AlertIcon size={12} aria-hidden="true" /> Backend offline: {apiError}
            </span>
          ) : (
            <span className="meta-status success">
              Status: 200 OK &bull; &ldquo;{apiMeta?.message || 'Documents retrieved successfully'}&rdquo; (
              {documents.length} document{documents.length !== 1 ? 's' : ''} loaded)
            </span>
          )}
        </div>
      </div>

      {/* Loading state */}
      {apiLoading && (
        <div className="library-loading-state" role="status" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true" />
          <p>Loading documents from MongoDB…</p>
        </div>
      )}

      {/* Error state (backend offline or request failure) */}
      {!apiLoading && apiError && (
        <div className="library-error-state" role="alert">
          <AlertIcon size={32} className="error-state-icon" aria-hidden="true" />
          <h3>Could not reach the backend</h3>
          <p>{apiError}</p>
          <p className="error-hint">
            Make sure the FastAPI server is running at <code>http://127.0.0.1:8000</code> and MongoDB is accessible.
          </p>
          <button
            type="button"
            className="empty-reset-btn"
            onClick={() => {
              setApiLoading(true);
              setApiError(null);
              fetchDocuments('all', 1)
                .then((data) => {
                  const rawDocs = Array.isArray(data.documents) ? data.documents : [];
                  setDocuments(rawDocs.map(normalizeDocument));
                  setApiMeta(data);
                  setApiLoading(false);
                })
                .catch((err) => {
                  setApiError(err.message || 'Failed to reach backend');
                  setApiLoading(false);
                });
            }}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Document Grid — rendered when data has loaded without error */}
      {!apiLoading && !apiError && (
        <DocumentGrid
          documents={filteredDocuments}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
          onAskAI={onAskAI}
        />
      )}

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowUploadModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-modal-title"
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <UploadIcon size={18} className="modal-icon" aria-hidden="true" />
                <h3 className="modal-title" id="upload-modal-title">
                  Ingest Research Document
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowUploadModal(false)}
                aria-label="Close upload dialog"
              >
                <CloseIcon size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-instruction">
                Upload PDFs, Markdown notes, or provide an arXiv ID to extract text,
                generate chunk embeddings, and index into ChromaDB.
              </p>

              <div
                className="upload-dropzone"
                role="button"
                tabIndex={0}
                aria-label="Drop files here or click to browse"
              >
                <UploadIcon size={32} className="dropzone-icon" aria-hidden="true" />
                <span className="dropzone-text">
                  Drag and drop research papers here, or <strong>browse files</strong>
                </span>
                <span className="dropzone-hint">
                  Supports PDF, EPUB, LaTeX, Markdown (up to 50 MB)
                </span>
              </div>

              <div className="modal-field">
                <label className="field-label" htmlFor="arxiv-input">
                  arXiv URL or ID (Optional):
                </label>
                <input
                  id="arxiv-input"
                  type="text"
                  placeholder="e.g. 1706.03762 or https://arxiv.org/abs/1706.03762"
                  className="field-input"
                  aria-describedby="arxiv-hint"
                />
              </div>

              <div className="modal-notice" id="arxiv-hint" role="note">
                <SparklesIcon size={14} className="notice-icon" aria-hidden="true" />
                <span>
                  <strong>Phase 3 Placeholder:</strong> Document upload will be connected
                  to Celery background workers and ChromaDB in Phase 3. No files are
                  actually stored at this time.
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
                onClick={() => setShowUploadModal(false)}
                title="Document ingestion pipeline will be activated in Phase 3"
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
