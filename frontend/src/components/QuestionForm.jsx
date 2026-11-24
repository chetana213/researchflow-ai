import { useState } from 'react';

// API base URL for the FastAPI backend
const API_BASE_URL = 'http://127.0.0.1:8000';

function QuestionForm() {
  // Controlled form state
  const [documentId, setDocumentId] = useState('doc_101');
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const trimmedDocId = documentId.trim();
    const trimmedQuestion = question.trim();

    // Client-side validation matching backend requirements
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
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_id: trimmedDocId,
          question: trimmedQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Extract validation message if returned by FastAPI (e.g. HTTP 422 detail array)
        const detailMsg = Array.isArray(data.detail)
          ? data.detail.map((err) => err.msg).join(', ')
          : data.detail || `Server error (${response.status})`;
        throw new Error(detailMsg);
      }

      // Display backend's actual response message
      setSuccessMessage(data.message || 'Question submitted successfully');
      // Clear the question field after success, while retaining document ID
      setQuestion('');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit question.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="question-form-section">
      <h2 className="section-title">Ask a Research Question</h2>

      <form onSubmit={handleSubmit} className="question-form">
        <div className="form-group">
          <label htmlFor="document-id">Document ID</label>
          <input
            id="document-id"
            type="text"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            placeholder="e.g. doc_101"
            className="form-input"
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="question-input">Your Question</label>
          <textarea
            id="question-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What are the key findings or methodology in this paper? (min 5 characters)"
            rows={3}
            className="form-textarea"
            disabled={submitting}
          />
          <small className="char-count">
            {question.length} / 2000 characters
          </small>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={submitting}
        >
          {submitting ? 'Submitting Question...' : 'Submit Question'}
        </button>

        {/* Feedback messages */}
        {successMessage && (
          <div className="form-feedback success">
            <p>✓ {successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="form-feedback error">
            <p>✕ {errorMessage}</p>
          </div>
        )}
      </form>
    </section>
  );
}

export default QuestionForm;
