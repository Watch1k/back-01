import { Video } from '../videos/types/video';
import { Blog } from '../blogs/types/blog';
import { Post } from '../posts/types/post';

interface Database {
  videos: Video[];
  blogs: Blog[];
  posts: Post[];
}

export const db: Database = {
  videos: [
    {
      id: 1,
      title: 'Getting Started with TypeScript',
      author: 'John Smith',
      canBeDownloaded: true,
      minAgeRestriction: 16,
      createdAt: '2024-03-15T10:00:00.000Z',
      publicationDate: '2024-03-16T10:00:00.000Z',
      availableResolutions: ['P144'],
    },
    {
      id: 2,
      title: 'Advanced JavaScript Patterns',
      author: 'Emma Wilson',
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: '2024-03-14T15:30:00.000Z',
      publicationDate: '2024-03-15T12:00:00.000Z',
      availableResolutions: ['P240', 'P240'],
    },
    {
      id: 3,
      title: 'Web Development Best Practices',
      author: 'Michael Chen',
      canBeDownloaded: true,
      minAgeRestriction: 13,
      createdAt: '2024-03-13T09:45:00.000Z',
      publicationDate: '2024-03-14T09:45:00.000Z',
      availableResolutions: ['P144', 'P144'],
    },
  ],
  blogs: [
    {
      id: '1',
      name: 'Technology Insights',
      description: 'Latest news and insights about technology trends',
      websiteUrl: 'https://tech-insights.example.com',
    },
    {
      id: '2',
      name: 'Web Development Blog',
      description: 'Tips and tricks for modern web development',
      websiteUrl: 'https://webdev-blog.example.com',
    },
    {
      id: '3',
      name: 'Programming Fundamentals',
      description: 'Back to basics with programming concepts and practices',
      websiteUrl: 'https://programming-fundamentals.example.com',
    },
  ],
  posts: [
    {
      id: '1',
      title: 'Introduction to TypeScript',
      shortDescription: 'Learn the basics of TypeScript and its benefits',
      content:
        'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
      blogId: '1',
      blogName: 'Technology Insights',
    },
    {
      id: '2',
      title: 'Modern CSS Techniques',
      shortDescription: 'Exploring the latest CSS features and methodologies',
      content:
        'CSS has evolved significantly in recent years. This post covers modern techniques like CSS Grid, Flexbox, and CSS Variables.',
      blogId: '2',
      blogName: 'Web Development Blog',
    },
    {
      id: '3',
      title: 'Understanding Recursion',
      shortDescription:
        'A deep dive into recursive functions and their applications',
      content:
        'Recursion is a powerful programming concept where a function calls itself to solve a problem. This post explains how it works and when to use it.',
      blogId: '3',
      blogName: 'Programming Fundamentals',
    },
    {
      id: '4',
      title: 'API Design Best Practices',
      shortDescription: 'Guidelines for creating robust and user-friendly APIs',
      content:
        'Designing good APIs is crucial for developer experience. This post covers naming conventions, error handling, and versioning strategies.',
      blogId: '1',
      blogName: 'Technology Insights',
    },
  ],
};
