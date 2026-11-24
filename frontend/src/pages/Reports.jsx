import { useState, useEffect } from 'react';
import { DEMO_REPORTS } from '../data/demoData';
import {
  ReportsIcon,
  SearchIcon,
  ClockIcon,
  CheckIcon,
  ExternalLinkIcon,
  CloseIcon,
  SparklesIcon,
} from '../components/icons/Icons';

export default function Reports() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [exportNotice, setExportNotice] = useState(null);

  // Auto-clear export notice after 2.5 s
  useEffect(() => {
    if (!exportNotice) return;
    const t = setTimeout(() => setExportNotice(null), 2500);
    return () => clearTimeout(t);
  }, [exportNotice]);

  const statuses = ['All', 'Ready', 'Processing', 'Draft'];

  const filteredReports = DEMO_REPORTS.filter((rep) => {
    const matchesStatus = statusFilter === 'All' || rep.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      rep.title.toLowerCase().includes(q) ||
      rep.tags.some((t) => t.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-header-row">
        <div>
          <h2 className="reports-main-title">Synthesized Research Reports</h2>
          <p className="reports-subtitle">
            Autonomous multi-paper literature syntheses and executive briefs
          </p>
        </div>

        <div className="reports-badge-status">
          <span className="reports-count-pill">
            <strong>{DEMO_REPORTS.length}</strong> Total Reports
          </span>
          <span className="reports-tag-pill">Demo Syntheses</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="reports-filter-bar">
        <div className="reports-search-box">
          <SearchIcon size={15} className="reports-search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by title or tags..."
            className="reports-search-input"
          />
        </div>

        <div className="reports-status-pills">
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              className={`status-pill-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length > 0 ? (
        <div className="reports-grid">
          {filteredReports.map((rep) => {
            const isReady = rep.status === 'Ready';
            const isProcessing = rep.status === 'Processing';
            return (
              <article key={rep.id} className="report-card">
                <div className="report-card-top">
                  <span
                    className={`report-status-badge ${
                      isReady ? 'ready' : isProcessing ? 'processing' : 'draft'
                    }`}
                  >
                    {rep.status}
                  </span>
                  <span className="report-date">{rep.date}</span>
                </div>

                <h3 className="report-title">{rep.title}</h3>
                <p className="report-summary">{rep.summary}</p>

                <div className="report-tags-row">
                  {rep.tags.map((tag) => (
                    <span key={tag} className="report-tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="report-card-footer">
                  <span className="report-pages">{rep.pages} Pages &bull; Markdown/PDF</span>

                  <button
                    type="button"
                    className="btn-preview-report"
                    onClick={() => setSelectedReport(rep)}
                  >
                    <span>Preview Brief</span>
                    <ExternalLinkIcon size={12} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-reports-state">
          <ReportsIcon size={32} className="empty-icon" />
          <h3>No research reports found</h3>
          <p>Try clearing your search query or selecting a different status filter.</p>
          <button
            type="button"
            className="empty-reset-btn"
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="modal-backdrop" onClick={() => setSelectedReport(null)}>
          <div className="modal-dialog modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span
                  className={`report-status-badge ${
                    selectedReport.status === 'Ready'
                      ? 'ready'
                      : selectedReport.status === 'Processing'
                      ? 'processing'
                      : 'draft'
                  }`}
                >
                  {selectedReport.status}
                </span>
                <h3 className="modal-title">{selectedReport.title}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedReport(null)}
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="modal-body report-preview-body">
              <div className="preview-meta-row">
                <span><strong>Date:</strong> {selectedReport.date}</span>
                <span><strong>Length:</strong> {selectedReport.pages} Pages</span>
                <span><strong>Format:</strong> Executive Markdown Report</span>
              </div>

              <div className="preview-section">
                <h4>Executive Summary</h4>
                <p>{selectedReport.summary}</p>
              </div>

              <div className="preview-section">
                <h4>Key Report Sections Included:</h4>
                <ul className="preview-sections-list">
                  {selectedReport.sections.map((sec, idx) => (
                    <li key={idx}>
                      <span className="sec-number">{idx + 1}.</span>
                      <span className="sec-title">{sec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="preview-notice-box">
                <SparklesIcon size={14} className="sparkle-gold" />
                <span>
                  This is a sample synthesis artifact. Automated report generation with Gemini 1.5 Pro and Celery background workers will be integrated in future phases.
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-modal-submit"
                onClick={() => setExportNotice(selectedReport.id)}
                disabled={exportNotice === selectedReport?.id}
              >
                {exportNotice === selectedReport?.id ? '✓ Export Queued' : 'Export Markdown'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
