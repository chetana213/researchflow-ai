import { useState, useEffect } from 'react';
import { SendIcon, SparklesIcon, CheckIcon, AlertIcon } from '../icons/Icons';
import { submitQuestion } from '../../services/api';

export default function QuestionForm({
  prefilledDocId = 'doc_101',
  prefilledTitle  = '',
  onQuestionSubmitted,
}) {
  const [documentId,     setDocumentId    ] = useState(prefilledDocId);
  const [question,       setQuestion      ] = useState('');
  const [submitting,     setSubmitting    ] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage,   setErrorMessage  ] = useState(null);

  // Sync if the active document changes from the selector
  useEffect(() => {
    if (prefilledDocId) setDocumentId(prefilledDocId);
  }, [prefilledDocId]);

  // Auto-clear feedback after 8 seconds
  useEffect(() => {
    if (!successMessage && !errorMessage) return;
    const t = setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 8000);
    return () => clearTimeout(t);
  }, [successMessage, errorMessage]);

  const charCount  = question.length;
  const isValid    = documentId.trim() && charCount >= 5 && charCount <= 2000;
  const charOver   = charCount > 2000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const trimmedDocId   = documentId.trim();
    const trimmedQuestion = question.trim();

    if (!trimmedDocId) {
      setErrorMessage('Document ID is required.');
      return;
    }
    if (trimmedQuestion.length < 5) {
      setErrorMessage('Question must be at least 5 characters long.');
      return;
    }
    if (trimmedQuestion.length > 2000) {
      setErrorMessage('Question cannot exceed 2000 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await submitQuestion(trimmedDocId, trimmedQuestion);
      setSuccessMessage(
        data.message || `Query acknowledged by FastAPI for '${trimmedDocId}'`
      );
      if (onQuestionSubmitted) {
        onQuestionSubmitted(trimmedDocId, trimmedQuestion, data);
      }
      setQuestion('');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit question to backend.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="research-composer-card">
      {/* ── Header ── */}
      <div className="composer-header">
        <div className="composer-header-left">
          <div className="composer-icon-pill" aria-hidden="true">
            <SparklesIcon size={14} />
          </div>
          <div>
            <h3 className="composer-title">AI Query Formulation</h3>
            <span className="composer-subtitle">
              Submits your question to FastAPI <code>POST /questions</code>
            </span>
          </div>
        </div>
        {prefilledTitle && (
          <div className="selected-doc-badge" aria-label={`Active document: ${prefilledTitle}`}>
            <span className="badge-label">Active Document:</span>
            <span className="badge-name" title={prefilledTitle}>
              {prefilledTitle.length > 45
                ? prefilledTitle.slice(0, 45) + '…'
                : prefilledTitle}
            </span>
          </div>
        )}
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="composer-form" noValidate>
        {/* Document ID row */}
        <div className="composer-doc-row">
          <label htmlFor="doc-id-select" className="composer-label">
            Target Document Context:
          </label>
          <div className="doc-select-group">
            <input
              id="doc-id-select"
              type="text"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              placeholder="e.g. doc_101"
              className="composer-doc-input"
              disabled={submitting}
              aria-describedby="doc-hint"
            />
            <span className="doc-hint" id="doc-hint">
              Demo document IDs: <code>doc_101</code> through <code>doc_106</code>
            </span>
          </div>
        </div>

        {/* Textarea */}
        <div className="composer-input-wrapper">
          <textarea
            id="research-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a technical question about methodology, architecture, or benchmark results (min 5 chars)…"
            rows={4}
            className={`composer-textarea${charOver ? ' textarea-error' : ''}`}
            disabled={submitting}
            aria-label="Research question"
            aria-describedby="char-count"
          />

          <div className="composer-footer">
            <span
              className={`composer-char-count${charOver ? ' char-over' : ''}`}
              id="char-count"
              aria-live="polite"
              aria-label={`${charCount} of 2000 characters used`}
            >
              {charCount} / 2000
            </span>
            <button
              type="submit"
              className={`composer-send-btn${submitting ? ' submitting' : ''}`}
              disabled={submitting || !isValid}
              aria-label={submitting ? 'Submitting question…' : 'Submit question'}
            >
              {submitting ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  <span>Submitting…</span>
                </>
              ) : (
                <>
                  <span>Submit Question</span>
                  <SendIcon size={14} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Backend feedback */}
        {successMessage && (
          <div className="composer-alert success-alert" role="status" aria-live="polite">
            <CheckIcon size={16} className="alert-icon" aria-hidden="true" />
            <div className="alert-content">
              <strong>Backend Response (HTTP 201):</strong> {successMessage}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="composer-alert error-alert" role="alert" aria-live="assertive">
            <AlertIcon size={16} className="alert-icon" aria-hidden="true" />
            <div className="alert-content">
              <strong>Error:</strong> {errorMessage}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
