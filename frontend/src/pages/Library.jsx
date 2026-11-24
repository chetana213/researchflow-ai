import { useState, useEffect, useRef, useCallback } from 'react';
import DocumentGrid from '../components/documents/DocumentGrid';
import { fetchDocuments, uploadDocument } from '../services/api';
import {
  UploadIcon,
  SparklesIcon,
  CloseIcon,
  AlertIcon,
  CheckIcon,
  BookIcon,
} from '../components/icons/Icons';

const KNOWN_CATEGORIES = [
  'All',
  'Deep Learning',
  'NLP',
  'RAG & Agents',
  'LLMs',
  'Reasoning',
  'AI Safety',
];

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

/**
 * Format bytes into human-readable file size string.
 */
function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Normalize a raw document object returned by GET /documents into the
 * shape expected by DocumentCard and DocumentGrid.
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

  // ── UI Filter State ────────────────────────────────────────────────────────
  const [searchQuery,      setSearchQuery     ] = useState(externalSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // ── Upload Modal State ──────────────────────────────────────────────────────
  const [showUploadModal,     setShowUploadModal    ] = useState(false);
  const [selectedFile,        setSelectedFile       ] = useState(null);
  const [uploadStatus,        setUploadStatus       ] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
  const [uploadError,         setUploadError        ] = useState(null);
  const [uploadSuccessMsg,    setUploadSuccessMsg   ] = useState(null);
  const [isDragging,          setIsDragging         ] = useState(false);
  const [librarySuccessNotice, setLibrarySuccessNotice] = useState(null);

  const fileInputRef = useRef(null);

  // Sync external search from topbar
  useEffect(() => {
    if (externalSearch !== undefined) setSearchQuery(externalSearch);
  }, [externalSearch]);

  // Sync category from Collections "Browse Papers" links
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Load documents from MongoDB via FastAPI
  const loadDocuments = useCallback(async () => {
    setApiLoading(true);
    setApiError(null);
    try {
      const data = await fetchDocuments('all', 1);
      const rawDocs = Array.isArray(data.documents) ? data.documents : [];
      setDocuments(rawDocs.map(normalizeDocument));
      setApiMeta(data);
    } catch (err) {
      setApiError(err.message || 'Failed to reach backend');
    } finally {
      setApiLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Auto-clear library success notification after 5 seconds
  useEffect(() => {
    if (!librarySuccessNotice) return;
    const timer = setTimeout(() => {
      setLibrarySuccessNotice(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [librarySuccessNotice]);

  // ── File Selection & Validation ─────────────────────────────────────────────
  const validateAndSelectFile = (file) => {
    if (!file) return;

    // Validate .pdf extension
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF files are supported. Please select a file ending in .pdf.');
      setSelectedFile(null);
      return;
    }

    // Validate 15 MB file size limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File exceeds the 15 MB limit (${formatFileSize(file.size)}). Please select a smaller PDF.`);
      setSelectedFile(null);
      return;
    }

    // Valid file selected
    setUploadError(null);
    setUploadSuccessMsg(null);
    setUploadStatus('idle');
    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSelectFile(file);
  };

  // ── Drag & Drop Handlers ────────────────────────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadStatus !== 'uploading') {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (uploadStatus === 'uploading') return;

    const file = e.dataTransfer.files?.[0];
    validateAndSelectFile(file);
  };

  // ── Modal Actions ───────────────────────────────────────────────────────────
  const handleOpenModal = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setUploadError(null);
    setUploadSuccessMsg(null);
    setIsDragging(false);
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    if (uploadStatus === 'uploading') return; // Prevent closing while in flight
    setShowUploadModal(false);
    setSelectedFile(null);
    setUploadStatus('idle');
    setUploadError(null);
    setUploadSuccessMsg(null);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ── Upload Submission ───────────────────────────────────────────────────────
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || uploadStatus === 'uploading') return;

    setUploadStatus('uploading');
    setUploadError(null);
    setUploadSuccessMsg(null);

    try {
      const createdDoc = await uploadDocument(selectedFile);
      setUploadStatus('success');
      const docTitle = createdDoc.title || selectedFile.name;
      setUploadSuccessMsg(`"${docTitle}" uploaded successfully!`);

      // Refresh documents list from MongoDB
      await loadDocuments();

      // Show banner in Library and close modal after short delay
      setLibrarySuccessNotice(`Document "${docTitle}" uploaded and indexed successfully.`);

      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err) {
      setUploadStatus('error');
      setUploadError(err.message || 'Failed to upload document');
    }
  };

  // ── Derived Data & Search ───────────────────────────────────────────────────
  const categories = buildCategories(documents);

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
          onClick={handleOpenModal}
          aria-label="Upload a research document"
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

      {/* Global Library Upload Success Banner */}
      {librarySuccessNotice && (
        <div className="upload-alert success library-alert-banner" role="status" aria-live="polite">
          <CheckIcon size={16} aria-hidden="true" />
          <span>{librarySuccessNotice}</span>
          <button
            type="button"
            className="btn-close-alert"
            onClick={() => setLibrarySuccessNotice(null)}
            aria-label="Dismiss alert"
          >
            <CloseIcon size={12} aria-hidden="true" />
          </button>
        </div>
      )}

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
            onClick={loadDocuments}
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

      {/* Interactive Upload Modal */}
      {showUploadModal && (
        <div
          className="modal-backdrop"
          onClick={handleCloseModal}
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
                onClick={handleCloseModal}
                disabled={uploadStatus === 'uploading'}
                aria-label="Close upload dialog"
              >
                <CloseIcon size={16} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="modal-body">
                <p className="modal-instruction">
                  Upload research papers in PDF format. Documents are verified and stored
                  in MongoDB for fast citation and agentic retrieval.
                </p>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileInputChange}
                  disabled={uploadStatus === 'uploading'}
                  aria-label="Upload PDF file"
                />

                {/* Dropzone or Selected File Display */}
                {!selectedFile ? (
                  <div
                    className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    aria-label="Drop PDF file here or click to browse"
                  >
                    <UploadIcon size={32} className="dropzone-icon" aria-hidden="true" />
                    <span className="dropzone-text">
                      Drag and drop research papers here, or <strong>browse files</strong>
                    </span>
                    <span className="dropzone-hint">
                      PDF files only (maximum 15 MB)
                    </span>
                  </div>
                ) : (
                  <div className="selected-file-card" aria-label="Selected file details">
                    <div className="selected-file-info">
                      <BookIcon size={22} className="selected-file-icon" aria-hidden="true" />
                      <div className="selected-file-text">
                        <span className="selected-file-name" title={selectedFile.name}>
                          {selectedFile.name}
                        </span>
                        <span className="selected-file-size">
                          {formatFileSize(selectedFile.size)}
                        </span>
                      </div>
                    </div>
                    {uploadStatus !== 'uploading' && (
                      <button
                        type="button"
                        className="btn-remove-file"
                        onClick={() => {
                          setSelectedFile(null);
                          setUploadError(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        title="Remove selected file"
                        aria-label="Remove selected file"
                      >
                        <CloseIcon size={14} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}

                {/* Error Banner */}
                {uploadError && (
                  <div className="upload-alert error" role="alert">
                    <AlertIcon size={16} aria-hidden="true" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Success Banner */}
                {uploadSuccessMsg && (
                  <div className="upload-alert success" role="status" aria-live="polite">
                    <CheckIcon size={16} aria-hidden="true" />
                    <span>{uploadSuccessMsg}</span>
                  </div>
                )}

                {/* Info Notice */}
                <div className="modal-notice" role="note">
                  <SparklesIcon size={14} className="notice-icon" aria-hidden="true" />
                  <span>
                    Uploaded documents are saved to backend storage and metadata is indexed in
                    MongoDB Atlas.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={handleCloseModal}
                  disabled={uploadStatus === 'uploading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-submit"
                  disabled={!selectedFile || uploadStatus === 'uploading' || uploadStatus === 'success'}
                >
                  {uploadStatus === 'uploading' ? (
                    <>
                      <div className="btn-spinner" aria-hidden="true" />
                      <span>Uploading…</span>
                    </>
                  ) : uploadStatus === 'success' ? (
                    <>
                      <CheckIcon size={14} aria-hidden="true" />
                      <span>Uploaded!</span>
                    </>
                  ) : (
                    'Start Ingestion'
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
