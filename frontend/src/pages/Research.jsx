import { useState, useEffect } from 'react';
import QuestionForm from '../components/research/QuestionForm';
import { DEMO_PAPERS } from '../data/demoData';
import {
  SparklesIcon,
  RefreshIcon,
} from '../components/icons/Icons';

export default function Research({ prefilledDocId = 'doc_101', prefilledTitle = '' }) {
  const [selectedDocId, setSelectedDocId] = useState(prefilledDocId);
  const [activeSession, setActiveSession] = useState('session-1');

  // Sync state if navigation props update
  useEffect(() => {
    if (prefilledDocId) {
      setSelectedDocId(prefilledDocId);
    }
  }, [prefilledDocId]);

  const selectedPaper =
    DEMO_PAPERS.find((p) => p.documentId === selectedDocId) || DEMO_PAPERS[0];

  const sessions = [
    {
      id: 'session-1',
      title: 'Attention Mechanism & Multi-Head Projections',
      docId: 'doc_101',
      date: 'Today, 11:42 AM',
      queries: 3,
    },
    {
      id: 'session-2',
      title: 'BERT Bidirectional Context Benchmarks',
      docId: 'doc_102',
      date: 'Yesterday',
      queries: 5,
    },
    {
      id: 'session-3',
      title: 'Hybrid Dense & Sparse RAG Architectures',
      docId: 'doc_103',
      date: 'Nov 21, 2026',
      queries: 8,
    },
  ];

  // Interactive conversation messages state
  const [messages, setMessages] = useState([
    {
      id: 'msg-seed-1',
      sender: 'user',
      name: 'You',
      time: 'Earlier',
      text: 'What is the primary motivation for removing recurrence in the Transformer?',
    },
    {
      id: 'msg-seed-2',
      sender: 'backend',
      badge: 'HTTP 201 Created',
      text: 'Question submitted successfully',
      docId: 'doc_101',
      endpoint: 'POST /questions',
    },
  ]);

  // Handle new submission from QuestionForm
  const handleQuestionSubmitted = (docId, questionText, responseData) => {
    const userMsg = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      name: 'You',
      time: 'Just now',
      text: questionText,
    };
    const botMsg = {
      id: `msg-${Date.now()}-b`,
      sender: 'backend',
      badge: 'HTTP 201 Created',
      text: responseData.message || 'Question submitted successfully',
      docId: docId,
      endpoint: 'POST /questions',
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleClearThread = () => {
    setMessages([]);
  };

  return (
    <div className="research-page">
      {/* Two Column Layout: Left Context/History, Right Interactive Workspace */}
      <div className="research-workspace-layout">
        {/* Left Side: Context & Session History */}
        <aside className="research-context-pane">
          {/* Active Context Card */}
          <div className="context-card">
            <div className="context-card-header">
              <span className="context-pill">Grounded Context</span>
              <span className="context-id">{selectedPaper?.documentId || 'doc_101'}</span>
            </div>
            <h4 className="context-paper-title">
              {selectedPaper?.title || prefilledTitle || 'Attention Is All You Need'}
            </h4>
            <p className="context-paper-authors">
              By {selectedPaper?.authors || 'Vaswani et al.'}
            </p>

            {/* Document Selector Dropdown */}
            <div className="context-selector-group">
              <label htmlFor="select-context-doc" className="context-label">
                Switch Document Context:
              </label>
              <select
                id="select-context-doc"
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="context-select"
              >
                {DEMO_PAPERS.map((paper) => (
                  <option key={paper.id} value={paper.documentId}>
                    {paper.documentId} — {paper.title.slice(0, 40)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Previous Research Sessions */}
          <div className="sessions-list-group">
            <div className="sessions-header">
              <span className="sessions-title">Research Sessions</span>
              <span className="sessions-count">{sessions.length} saved</span>
            </div>

            <div className="sessions-items">
              {sessions.map((sess) => (
                <button
                  key={sess.id}
                  type="button"
                  className={`session-item ${activeSession === sess.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSession(sess.id);
                    setSelectedDocId(sess.docId);
                  }}
                  title={`Switch to session: ${sess.title}`}
                >
                  <div className="session-item-title">{sess.title}</div>
                  <div className="session-item-meta">
                    <span>{sess.docId}</span>
                    <span>&bull;</span>
                    <span>{sess.date}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RAG Citation Preview Box (Clearly marked as future feature) */}
          <div className="citation-preview-box">
            <div className="citation-header">
              <SparklesIcon size={14} className="sparkle-gold" />
              <span>Multi-Hop Citation Retrieval</span>
            </div>
            <p className="citation-desc">
              When LangGraph orchestration is connected in Phase 4, extracted vector chunks will be displayed here with exact page &amp; paragraph anchors.
            </p>
          </div>
        </aside>

        {/* Right Side: Main Chat & Question Form Workspace */}
        <section className="research-main-pane">
          {/* Conversation Feed */}
          <div className="chat-thread">
            {/* Thread Header Controls */}
            <div className="chat-thread-header">
              <div className="thread-header-left">
                <span className="thread-title">Interactive Query Thread</span>
                <span className="thread-pill">
                  {messages.filter((m) => m.sender === 'user').length} Inquiries
                </span>
              </div>
              <button
                type="button"
                className="btn-clear-thread"
                onClick={handleClearThread}
                title="Reset conversation thread"
              >
                <RefreshIcon size={13} />
                <span>Reset Thread</span>
              </button>
            </div>

            {/* System Greeting Message */}
            <div className="message-row assistant-row">
              <div className="message-avatar bot-avatar">
                <SparklesIcon size={16} />
              </div>
              <div className="message-bubble assistant-bubble">
                <div className="bubble-header">
                  <span className="bubble-sender">ResearchFlow AI Assistant</span>
                  <span className="bubble-time">Live Session</span>
                </div>
                <div className="bubble-body">
                  <p>
                    Hello Chetana. I am ready to analyze your active document (
                    <code>{selectedDocId}</code>: &ldquo;{selectedPaper?.title}&rdquo;).
                  </p>
                  <p>
                    Use the question composer below to submit technical inquiries. Each request is routed directly to the FastAPI <code>POST /questions</code> endpoint.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Message History */}
            {messages.map((msg) => {
              if (msg.sender === 'user') {
                return (
                  <div key={msg.id} className="message-row user-row">
                    <div className="message-avatar user-avatar-msg">CJ</div>
                    <div className="message-bubble user-bubble">
                      <div className="bubble-header">
                        <span className="bubble-sender">{msg.name}</span>
                        <span className="bubble-time">{msg.time}</span>
                      </div>
                      <div className="bubble-body">
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={msg.id} className="message-row assistant-row">
                  <div className="message-avatar bot-avatar">
                    <SparklesIcon size={16} />
                  </div>
                  <div className="message-bubble assistant-bubble">
                    <div className="bubble-header">
                      <span className="bubble-sender">FastAPI Backend Acknowledgment</span>
                      <span className="bubble-badge status-201">{msg.badge || 'HTTP 201 Created'}</span>
                    </div>
                    <div className="bubble-body">
                      <p className="acknowledged-text">
                        &ldquo;{msg.text}&rdquo;
                      </p>
                      <div className="acknowledgment-meta">
                        <span>Document ID: <code>{msg.docId}</code></span>
                        <span>Endpoint: <code>{msg.endpoint}</code></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {messages.length === 0 && (
              <div className="empty-thread-notice">
                <span>Thread cleared. Submit a new question below to start a new inquiry thread.</span>
              </div>
            )}
          </div>

          {/* Integrated Question Form Composer */}
          <div className="research-composer-container">
            <QuestionForm
              prefilledDocId={selectedDocId}
              prefilledTitle={selectedPaper?.title}
              onQuestionSubmitted={handleQuestionSubmitted}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
