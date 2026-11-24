import { useState } from 'react';
import { SettingsIcon, CheckIcon, SparklesIcon, RefreshIcon } from '../components/icons/Icons';
import { API_BASE_URL } from '../services/api';

export default function Settings() {
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);
  const [saved, setSaved] = useState(false);

  // Interactive UI Preferences toggles (stored in local React state)
  const [preferences, setPreferences] = useState({
    autoPollBackend: true,
    compactMode: false,
    showShortcuts: true,
    contrastFocus: true,
    desktopNotifications: false,
  });

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="settings-main-title">Platform Settings & Controls</h2>
        <p className="settings-subtitle">
          Configure API endpoints, model parameters, and workspace interface preferences
        </p>
      </div>

      <div className="settings-sections-list">
        {/* Section 1: Interactive Workspace Preferences (Real State Toggles) */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3 className="card-section-title">Interface & Workspace Preferences</h3>
            <span className="setting-tag">Interactive Controls</span>
          </div>
          <p className="card-section-desc">
            Customize your research workspace display, density, and client-side polling behaviors.
          </p>

          <div className="preference-toggles-list">
            {/* Toggle 1 */}
            <div className="preference-row">
              <div className="pref-info">
                <span className="pref-title">Live Backend Health Monitoring</span>
                <span className="pref-desc">
                  Continuously check FastAPI server status at <code>/health</code> in topbar
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.autoPollBackend}
                className={`toggle-switch ${preferences.autoPollBackend ? 'active' : ''}`}
                onClick={() => handleToggle('autoPollBackend')}
                title={preferences.autoPollBackend ? 'Disable live polling' : 'Enable live polling'}
              >
                <span className="toggle-thumb" />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="preference-row">
              <div className="pref-info">
                <span className="pref-title">Compact Card Density</span>
                <span className="pref-desc">
                  Reduce vertical margins and paddings for document cards and feeds
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.compactMode}
                className={`toggle-switch ${preferences.compactMode ? 'active' : ''}`}
                onClick={() => handleToggle('compactMode')}
                title={preferences.compactMode ? 'Disable compact mode' : 'Enable compact mode'}
              >
                <span className="toggle-thumb" />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="preference-row">
              <div className="pref-info">
                <span className="pref-title">Keyboard Navigation Badges (⌘K)</span>
                <span className="pref-desc">
                  Display hotkey indicators on search inputs and modal triggers
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.showShortcuts}
                className={`toggle-switch ${preferences.showShortcuts ? 'active' : ''}`}
                onClick={() => handleToggle('showShortcuts')}
                title={preferences.showShortcuts ? 'Hide hotkey badges' : 'Show hotkey badges'}
              >
                <span className="toggle-thumb" />
              </button>
            </div>

            {/* Toggle 4 */}
            <div className="preference-row">
              <div className="pref-info">
                <span className="pref-title">High-Contrast Accessible Focus Rings</span>
                <span className="pref-desc">
                  Accentuate outline focus borders with glowing <code>#8B7CFF</code> highlights
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.contrastFocus}
                className={`toggle-switch ${preferences.contrastFocus ? 'active' : ''}`}
                onClick={() => handleToggle('contrastFocus')}
                title={preferences.contrastFocus ? 'Disable contrast focus' : 'Enable contrast focus'}
              >
                <span className="toggle-thumb" />
              </button>
            </div>

            {/* Toggle 5 */}
            <div className="preference-row">
              <div className="pref-info">
                <span className="pref-title">Desktop Query Notifications</span>
                <span className="pref-desc">
                  Trigger desktop browser notifications when background synthesis tasks conclude
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.desktopNotifications}
                className={`toggle-switch ${preferences.desktopNotifications ? 'active' : ''}`}
                onClick={() => handleToggle('desktopNotifications')}
                title={
                  preferences.desktopNotifications
                    ? 'Disable notifications'
                    : 'Enable notifications'
                }
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Backend API Configuration */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3 className="card-section-title">Backend API Connection</h3>
            <span className="setting-tag">Active</span>
          </div>
          <p className="card-section-desc">
            Direct REST connection between this React client and the FastAPI backend service.
          </p>

          <form onSubmit={handleSave} className="settings-form">
            <div className="settings-field">
              <label htmlFor="api-url-input" className="field-label">
                FastAPI Server URL:
              </label>
              <input
                id="api-url-input"
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="field-input"
              />
              <span className="field-hint">
                Default local endpoint: <code>http://127.0.0.1:8000</code>
              </span>
            </div>

            <div className="settings-actions">
              <button type="submit" className="btn-save-settings">
                Save Preferences
              </button>
              {saved && (
                <span className="save-confirmed">
                  <CheckIcon size={14} /> Preferences updated in local state
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Section 3: AI & Vector Architecture Preview */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3 className="card-section-title">Planned AI & Vector Architecture</h3>
            <span className="setting-tag planned">Phase 3 & 4 Roadmap</span>
          </div>

          <div className="settings-grid-specs">
            <div className="spec-item">
              <span className="spec-label">Language Model</span>
              <span className="spec-value">Google Gemini API (via LangGraph)</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Vector Store</span>
              <span className="spec-value">ChromaDB (Local persistent)</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Document Store</span>
              <span className="spec-value">MongoDB (Motor async driver)</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Background Queue</span>
              <span className="spec-value">Redis + Celery async workers</span>
            </div>
          </div>
        </div>

        {/* Section 4: System Diagnostics */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3 className="card-section-title">System Diagnostics</h3>
          </div>
          <div className="system-info-list">
            <div className="info-row">
              <span className="info-key">Frontend Framework:</span>
              <span className="info-val">React 19 + Vite 6 (JavaScript)</span>
            </div>
            <div className="info-row">
              <span className="info-key">Backend Framework:</span>
              <span className="info-val">Python 3.13 + FastAPI 0.165</span>
            </div>
            <div className="info-row">
              <span className="info-key">CORS Configuration:</span>
              <span className="info-val">Enabled (Origins: localhost:3000, 127.0.0.1:3000)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
