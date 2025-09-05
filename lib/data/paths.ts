import path from 'path';

export const dataDir = path.resolve(process.cwd(), 'data');

export const files = {
  blogs: path.join(dataDir, 'blogs.json'),
  categories: path.join(dataDir, 'categories.json'),
  tags: path.join(dataDir, 'tags.json'),
  authors: path.join(dataDir, 'authors.json'),
} as const;

