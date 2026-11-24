import { SparklesIcon, ClockIcon } from '../icons/Icons';

export default function DocumentCard({
  documentId = 'doc_101',
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
    <article className={`document-card ${isList ? 'list-card' : 'grid-card'}`}>
      <div className="doc-card-header">
        <div className="doc-badge-group">
          <span className="doc-category-badge">{category}</span>
          {documentId && <span className="doc-id-badge">{documentId}</span>}
        </div>
        {year && <span className="doc-year">{year}</span>}
      </div>

      <div className="doc-card-body">
        <h3 className="doc-title" title={title}>
          {title}
        </h3>
        {authors && <p className="doc-authors">By {authors}</p>}
        {!isList && abstract && <p className="doc-abstract">{abstract}</p>}
      </div>

      {tags.length > 0 && (
        <div className="doc-tags">
          {tags.slice(0, isList ? 2 : 3).map((tag) => (
            <span key={tag} className="doc-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="doc-card-footer">
        <div className="doc-meta-stats">
          {citations && (
            <span className="doc-stat-item">
              <strong className="stat-highlight">{citations}</strong> citations
            </span>
          )}
          {readTime && (
            <span className="doc-stat-item">
              <ClockIcon size={12} className="meta-icon" />
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
            title={`Ask AI question grounded on ${documentId}`}
          >
            <SparklesIcon size={13} />
            <span>Ask AI</span>
          </button>
        )}
      </div>
    </article>
  );
}
