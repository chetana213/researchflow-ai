import { SparklesIcon, UploadIcon, LibraryIcon } from '../icons/Icons';

export default function QuickActions({ onAction }) {
  return (
    <div className="quick-actions-grid">
      <button
        type="button"
        className="action-card action-primary"
        onClick={() => onAction('research')}
      >
        <div className="action-icon-wrapper primary-glow">
          <SparklesIcon size={18} />
        </div>
        <div className="action-content">
          <span className="action-title">Ask AI Research Assistant</span>
          <span className="action-subtitle">
            Query documents with grounded contextual citations
          </span>
        </div>
      </button>

      <button
        type="button"
        className="action-card"
        onClick={() => onAction('library')}
      >
        <div className="action-icon-wrapper">
          <LibraryIcon size={18} />
        </div>
        <div className="action-content">
          <span className="action-title">Explore Research Library</span>
          <span className="action-subtitle">
            Browse peer-reviewed papers and foundational models
          </span>
        </div>
      </button>

      <button
        type="button"
        className="action-card"
        onClick={() => onAction('upload')}
      >
        <div className="action-icon-wrapper">
          <UploadIcon size={18} />
        </div>
        <div className="action-content">
          <span className="action-title">Upload New Document</span>
          <span className="action-subtitle">
            Ingest PDF, Markdown, or arXiv papers for vector indexing
          </span>
        </div>
      </button>
    </div>
  );
}
