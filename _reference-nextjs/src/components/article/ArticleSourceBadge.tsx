'use client';

interface ArticleSourceBadgeProps {
  source: 'wordpress' | 'cache';
}

export default function ArticleSourceBadge({ source }: ArticleSourceBadgeProps) {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: source === 'wordpress' ? '#d97706' : '#10b981',
      color: 'white',
      padding: '6px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <span>{source === 'wordpress' ? '🔁' : '✅'}</span>
      <span>
        {source === 'wordpress' ? 'Chargé via WordPress API' : 'Chargé depuis le cache'}
      </span>
    </div>
  );
} 