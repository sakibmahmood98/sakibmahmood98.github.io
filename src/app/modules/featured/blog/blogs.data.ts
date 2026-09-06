export interface BlogPost {
  slug: string;
  title: string;
  publishedOn: string;
  excerpt: string;
  tags: string[];
  url: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'three-claude-code-accounts-one-machine',
    title: 'How I Run Three Claude Code Accounts on One Machine',
    publishedOn: 'Sep 2026',
    excerpt: 'Using simple config files and command shortcuts to manage separate personal, work, and client Claude Code accounts on one laptop, with the --settings flag and a few batch files to switch between isolated environments instantly.',
    tags: ['Claude', 'Software Engineering', 'Claude Code'],
    url: 'https://medium.com/@sakibmahmood09/how-i-run-three-claude-code-accounts-on-one-laptop-6ec4cace60c2',
  },
  {
    slug: 'stop-10000-people-buying-same-seat',
    title: 'How We Stop 10,000 People From Buying the Same Seat',
    publishedOn: 'Sep 2026',
    excerpt: 'How a ticketing platform prevents overbooking during high-traffic sales using distributed locking with Redis and short-lived holds — the lock only covers a few milliseconds of math, not the whole checkout.',
    tags: ['Distributed Systems', 'System Design Concepts', 'Software Engineering', 'Online Booking System'],
    url: 'https://medium.com/@sakibmahmood09/how-we-stop-10-000-people-from-buying-the-same-seat-7b24b92643d3',
  },
  {
    slug: 'pause-button-that-broke',
    title: 'The Pause Button That Broke in the Worst Way Possible',
    publishedOn: 'Sep 2026',
    excerpt: "A call-transcription app's pause/resume feature silently failed from conflicting signals across redundant systems — fixed with a single source of truth, confirmation handshakes, and automatic recovery.",
    tags: ['Reliability Engineering', 'Software Engineering', 'Startup', 'Debugging'],
    url: 'https://medium.com/@sakibmahmood09/the-pause-button-that-broke-in-the-worst-way-possible-8a5cf01efd37',
  },
  // Add new posts here as you publish - newest first.
];
