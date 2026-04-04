export function isWithinNewTalentWindow(createdAt: Date | string): boolean {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return (now - created) < sevenDays;
}

export function timeAgo(date: Date | string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export const CATEGORIES = [
  { name: 'Haircuts & Barbering', icon: '✂️', color: '#EA580C' },
  { name: 'Sewing & Fashion',     icon: '🧵', color: '#7C3AED' },
  { name: 'Tutoring',             icon: '📚', color: '#2563EB' },
  { name: 'Laptop & Tech Repair', icon: '💻', color: '#059669' },
  { name: 'Graphic Design',       icon: '🎨', color: '#D97706' },
  { name: 'Photography',          icon: '📷', color: '#DB2777' },
  { name: 'Food & Catering',      icon: '🍲', color: '#DC2626' },
  { name: 'Music & Audio',        icon: '🎵', color: '#4F46E5' },
  { name: 'Language Help',        icon: '🌍', color: '#0891B2' },
  { name: 'Other unique Talents',                icon: '⭐', color: '#6B7280' },
] as const;