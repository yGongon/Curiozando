import type { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  title: string;
  deck: string; // The subtitle or summary line
  content: string; // Markdown content
  imageUrl: string;
  category: string;
  sources?: Array<{ title: string; uri: string; }>;
  createdAt: Timestamp;
}