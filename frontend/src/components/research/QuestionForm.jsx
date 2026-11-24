import { useState, useEffect } from 'react';
import { SendIcon, SparklesIcon, CheckIcon, AlertIcon } from '../icons/Icons';
import { submitQuestion } from '../../services/api';

export default function QuestionForm({
  prefilledDocId = 'doc_101',
  prefilledTitle = '',
  onQuestionSubmitted,
}) {
  const [documentId, setDocumentId] = useState(prefilledDocId);
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync if prefilledDocId changes
  useEffect(() => {
    if (prefilledDocId) setDocumentId(prefilledDocId);
  }, [prefilledDocId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const trimmedDocId = documentId.trim();
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
      // Display backend's actual response message
      setSuccessMessage(
        data.message || `Query successfully acknowledged by FastAPI for '${trimmedDocId}'`
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
      <div className="composer-header">
        <div className="composer-header-left">
          <div className="composer-icon-pill">
            <SparklesIcon size={14} />
          </div>
          <div>
            <h3 className="composer-title">AI Query Formulation</h3>
            <span className="composer-subtitle">
              Grounds your prompt using document chunk vectors & attention embeddings
            </span>
          </div>
        </div>

        {prefilledTitle && (
          <div className="selected-doc-badge">
            <span className="badge-label">Active Document:</span>
            <span className="badge-name">{prefilledTitle}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="composer-form">
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
            />
            <span className="doc-hint">
              (Existing demo document: <code>doc_101</code>)
            </span>
          </div>
        </div>

        <div className="composer-input-wrapper">
          <textarea
            id="research-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a technical question about methodology, architecture, or benchmark results (min 5 chars)..."
            rows={3}
            className="composer-textarea"
            disabled={submitting}
          />

          <div className="composer-footer">
            <span className="composer-char-count">
              {question.length} / 2000 characters
            </span>

            <button
              type="submit"
              className="composer-send-btn"
              disabled={submitting || question.trim().length < 5}
            >
              {submitting ? (
                <>
                  <span className="btn-spinner" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Question</span>
                  <SendIcon size={14} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real Backend Feedback alerts */}
        {successMessage && (
          <div className="composer-alert success-alert">
            <CheckIcon size={16} className="alert-icon" />
            <div className="alert-content">
              <strong>Backend Response:</strong> {successMessage}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="composer-alert error-alert">
            <AlertIcon size={16} className="alert-icon" />
            <div className="alert-content">
              <strong>Backend Error:</strong> {errorMessage}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
