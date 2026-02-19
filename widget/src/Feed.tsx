import { h, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import type { ChangelogEntry, WidgetSettings, ReactionCounts } from './api';
import { fetchReactions, toggleReaction } from './api';
import { getFingerprint } from './storage';

const REACTION_EMOJIS = ['👍', '🎉', '❤️'];

interface FeedProps {
  entries: ChangelogEntry[];
  settings: WidgetSettings;
  isOpen: boolean;
  onClose: () => void;
}

export function Feed({ entries, settings, isOpen, onClose }: FeedProps) {
  if (!isOpen) return null;

  const positionStyles = settings.position === 'bottom-right'
    ? { bottom: '90px', right: '20px' }
    : { bottom: '90px', left: '20px' };

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles,
        width: '400px',
        maxHeight: '600px',
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        zIndex: 999998,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#222',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#fff' }}>
          What's New
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#999',
            cursor: 'pointer',
            fontSize: '24px',
            lineHeight: '1',
            padding: 0,
          }}
          aria-label="Close changelog"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {entries.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '40px 20px' }}>
            No updates yet. Check back soon!
          </p>
        ) : (
          entries.map((entry, index) => (
            <ChangelogItem key={entry._id || index} entry={entry} primaryColor={settings.primaryColor} />
          ))
        )}
      </div>

      {/* Footer */}
      {settings.showBranding && (
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #333',
            textAlign: 'center',
            fontSize: '12px',
            color: '#666',
          }}
        >
          Powered by <span style={{ color: settings.primaryColor }}>ReleaseDock</span>
        </div>
      )}
    </div>
  );
}

interface ChangelogItemProps {
  key?: string | number;
  entry: ChangelogEntry;
  primaryColor: string;
}

function ChangelogItem({ entry, primaryColor }: ChangelogItemProps) {
  const formattedDate = new Date(entry.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #333' }}>
      {entry.coverImageUrl && (
        <img
          src={entry.coverImageUrl}
          alt=""
          style={{
            width: '100%',
            height: '160px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '12px',
          }}
        />
      )}
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#fff' }}>
        {entry.title}
      </h3>
      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#999' }}>
        {formattedDate}
      </p>

      {entry.categories && entry.categories.length > 0 && (
        <div style={{ marginBottom: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {entry.categories.map((cat, idx) => (
            <span
              key={`cat-${idx}`}
              style={{
                display: 'inline-block',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '11px',
                fontWeight: '500',
                backgroundColor: cat.color + '18',
                color: cat.color,
                border: `1px solid ${cat.color}30`,
              }}
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}

      {entry.labels.length > 0 && (
        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {entry.labels.map((label, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: label.color + '20',
                color: label.color,
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      <div style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6' }}>
        <BlockNoteRenderer content={entry.content} />
      </div>

      {entry._id && <ReactionBar changelogId={entry._id} primaryColor={primaryColor} />}
    </div>
  );
}

// --- Reaction Bar ---

interface ReactionBarProps {
  changelogId: string;
  primaryColor: string;
}

function ReactionBar({ changelogId, primaryColor }: ReactionBarProps) {
  const [counts, setCounts] = useState<ReactionCounts>({});
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fp = getFingerprint();
    fetchReactions(changelogId, fp).then((data) => {
      setCounts(data.counts);
      setUserReactions(data.userReactions);
    });
  }, [changelogId]);

  const handleToggle = async (emoji: string) => {
    if (loading) return;
    setLoading(true);
    const fp = getFingerprint();

    // Optimistic update
    const wasActive = userReactions.includes(emoji);
    setUserReactions((prev) =>
      wasActive ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
    setCounts((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + (wasActive ? -1 : 1),
    }));

    try {
      await toggleReaction(changelogId, emoji, fp);
    } catch {
      // Revert on error
      setUserReactions((prev) =>
        wasActive ? [...prev, emoji] : prev.filter((e) => e !== emoji)
      );
      setCounts((prev) => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + (wasActive ? 1 : -1),
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
      {REACTION_EMOJIS.map((emoji) => {
        const isActive = userReactions.includes(emoji);
        const count = counts[emoji] || 0;
        return (
          <button
            key={emoji}
            onClick={() => handleToggle(emoji)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '16px',
              border: isActive ? `1.5px solid ${primaryColor}` : '1.5px solid #444',
              backgroundColor: isActive ? `${primaryColor}20` : 'transparent',
              color: isActive ? primaryColor : '#999',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            aria-label={`React with ${emoji}`}
            aria-pressed={isActive}
          >
            <span>{emoji}</span>
            {count > 0 && <span style={{ fontSize: '12px', fontWeight: '500' }}>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

// --- BlockNote content renderer ---

function BlockNoteRenderer({ content }: { content: any }) {
  if (!content || !Array.isArray(content)) return null;

  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < content.length) {
    const block = content[i];

    if (block.type === 'bulletListItem') {
      const items: any[] = [];
      while (i < content.length && content[i].type === 'bulletListItem') {
        items.push(content[i]);
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
          {items.map((item: any, idx: number) => (
            <li key={idx} style={{ marginBottom: '4px' }}>{renderInlineContent(item.content)}</li>
          ))}
        </ul>
      );
    } else if (block.type === 'numberedListItem') {
      const items: any[] = [];
      while (i < content.length && content[i].type === 'numberedListItem') {
        items.push(content[i]);
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
          {items.map((item: any, idx: number) => (
            <li key={idx} style={{ marginBottom: '4px' }}>{renderInlineContent(item.content)}</li>
          ))}
        </ol>
      );
    } else {
      elements.push(<BlockRenderer key={i} block={block} />);
      i++;
    }
  }

  return <Fragment>{elements}</Fragment>;
}

function renderInlineContent(inlineContent: any[]): string {
  if (!inlineContent) return '';
  return inlineContent
    .map((item: any) => {
      if (typeof item === 'string') return item;
      if (item.type === 'text') return item.text || '';
      return '';
    })
    .join('');
}

interface BlockRendererProps {
  key?: number;
  block: any;
}

function BlockRenderer({ block }: BlockRendererProps) {
  const { type, content } = block;

  switch (type) {
    case 'paragraph':
      return <p style={{ margin: '0 0 12px 0' }}>{renderInlineContent(content)}</p>;

    case 'heading': {
      const level = block.props?.level || 1;
      const sizes: Record<number, string> = { 1: '24px', 2: '20px', 3: '18px' };
      const Tag = `h${level}` as any;
      return (
        <Tag style={{ fontSize: sizes[level] || '18px', fontWeight: '600', margin: '0 0 12px 0' }}>
          {renderInlineContent(content)}
        </Tag>
      );
    }

    case 'image':
      return (
        <img
          src={block.props?.url}
          alt={block.props?.caption || ''}
          style={{ maxWidth: '100%', borderRadius: '8px', margin: '12px 0' }}
        />
      );

    default:
      return <p style={{ margin: '0 0 12px 0' }}>{renderInlineContent(content)}</p>;
  }
}
