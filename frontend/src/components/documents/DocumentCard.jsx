import { SparklesIcon, ClockIcon } from '../icons/Icons';

export default function DocumentCard({
  documentId = '',
  title,
  authors,
  category = 'General',
  year,
  citations,
  readTime,
  abstract,
  tags = [],
  viewMode = 'grid',
  onAskAI,
}) {
  const isList = viewMode === 'list';

  return (
    <article
      className={`document-card ${isList ? 'list-card' : 'grid-card'}`}
      aria-label={`Research paper: ${title}`}
    >
      <div className="doc-card-header">
        <div className="doc-badge-group">
          <span className="doc-category-badge" aria-label={`Category: ${category}`}>
            {category}
          </span>
          {documentId && (
            <span className="doc-id-badge" aria-label={`Document ID: ${documentId}`}>
              {documentId}
            </span>
          )}
        </div>
        {year && <span className="doc-year" aria-label={`Published ${year}`}>{year}</span>}
      </div>

      <div className="doc-card-body">
        <h3 className="doc-title" title={title}>{title}</h3>
        {authors && (
          <p className="doc-authors">By {authors}</p>
        )}
        {/* Only show abstract in grid view */}
        {!isList && abstract && (
          <p className="doc-abstract">{abstract}</p>
        )}
      </div>

      {tags.length > 0 && (
        <div className="doc-tags" aria-label="Tags">
          {tags.slice(0, isList ? 2 : 3).map((tag) => (
            <span key={tag} className="doc-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="doc-card-footer">
        <div className="doc-meta-stats">
          {citations && (
            <span className="doc-stat-item" aria-label={`${citations} citations`}>
              <strong className="stat-highlight">{citations}</strong> citations
            </span>
          )}
          {readTime && (
            <span className="doc-stat-item" aria-label={`Read time: ${readTime}`}>
              <ClockIcon size={12} className="meta-icon" aria-hidden="true" />
              {readTime}
            </span>
          )}
        </div>

        {onAskAI && (
          <button
            type="button"
            className="doc-ask-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAskAI(documentId, title);
            }}
            title={`Ask AI about: ${title}`}
            aria-label={`Ask AI about ${title} (${documentId})`}
          >
            <SparklesIcon size={13} aria-hidden="true" />
            <span>Ask AI</span>
          </button>
        )}
      </div>
    </article>
  );
}
