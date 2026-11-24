/**
 * ResearchFlow AI - Centralized Backend API Client
 * Uses native fetch() to communicate with the FastAPI backend.
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Fetch document listing metadata from the backend.
 * @param {string} category - Document category filter (defaults to 'all')
 * @param {number} page - Page number (defaults to 1)
 */
export async function fetchDocuments(category = 'all', page = 1) {
  const query = new URLSearchParams({ category, page: String(page) });
  const response = await fetch(`${API_BASE_URL}/documents?${query.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch documents: HTTP ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch a single document by its ID.
 * @param {string} documentId - The document identifier (e.g. 'doc_101')
 */
export async function fetchDocumentById(documentId) {
  const response = await fetch(`${API_BASE_URL}/documents/${encodeURIComponent(documentId)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch document '${documentId}': HTTP ${response.status}`);
  }
  return response.json();
}

/**
 * Submit a research question for a specific document.
 * @param {string} documentId - Target document identifier
 * @param {string} question - Research query (min 5, max 2000 chars)
 */
export async function submitQuestion(documentId, question) {
  const response = await fetch(`${API_BASE_URL}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document_id: documentId,
      question: question,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detailMsg = Array.isArray(data.detail)
      ? data.detail.map((err) => err.msg).join(', ')
      : data.detail || `Server error (${response.status})`;
    throw new Error(detailMsg);
  }

  return data;
}

/**
 * Check backend system health status.
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) return { status: 'unhealthy', code: response.status };
    const data = await response.json();
    return { status: data.status || 'healthy', ...data };
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

export { API_BASE_URL };
