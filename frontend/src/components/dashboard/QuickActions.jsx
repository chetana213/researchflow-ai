import { SparklesIcon, LibraryIcon, UploadIcon, CollectionsIcon } from '../icons/Icons';

const ACTIONS = [
  {
    id: 'research',
    title: 'Ask AI Research Assistant',
    subtitle: 'Query documents with grounded contextual citations',
    icon: SparklesIcon,
    variant: 'action-primary',
    glow: 'primary-glow',
  },
  {
    id: 'library',
    title: 'Explore Research Library',
    subtitle: 'Browse peer-reviewed papers and foundational models',
    icon: LibraryIcon,
    variant: '',
    glow: '',
  },
  {
    id: 'collections',
    title: 'Browse Collections',
    subtitle: 'Explore thematic paper sets and curated reading lists',
    icon: CollectionsIcon,
    variant: '',
    glow: '',
  },
  {
    id: 'upload',
    title: 'Upload New Document',
    subtitle: 'Ingest PDF, Markdown, or arXiv papers for vector indexing',
    icon: UploadIcon,
    variant: '',
    glow: '',
  },
];

export default function QuickActions({ onAction }) {
  return (
    <div className="quick-actions-grid" role="list" aria-label="Quick actions">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            className={`action-card ${action.variant}`.trim()}
            onClick={() => onAction(action.id)}
            aria-label={action.title}
            role="listitem"
          >
            <div className={`action-icon-wrapper ${action.glow}`.trim()}>
              <Icon size={18} aria-hidden="true" />
            </div>
            <div className="action-content">
              <span className="action-title">{action.title}</span>
              <span className="action-subtitle">{action.subtitle}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
