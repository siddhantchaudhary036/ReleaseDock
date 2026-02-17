import { h } from 'preact';

interface LauncherProps {
  position: 'bottom-right' | 'bottom-left';
  primaryColor: string;
  unreadCount: number;
  onClick: () => void;
}

export function Launcher({ position, primaryColor, unreadCount, onClick }: LauncherProps) {
  const positionStyles = position === 'bottom-right'
    ? { bottom: '20px', right: '20px' }
    : { bottom: '20px', left: '20px' };

  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        ...positionStyles,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: primaryColor,
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        transition: 'transform 0.2s',
      }}
      aria-label="Open changelog"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '12px',
            padding: '2px 6px',
            fontSize: '12px',
            fontWeight: 'bold',
            minWidth: '20px',
            textAlign: 'center',
          }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}
