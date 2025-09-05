import { readList, writeList, genId } from './fs';
import { files } from './paths';
import type { Blog, CreateBlogInput } from '@/lib/types';
import { uniqueSlug } from '@/lib/utils/slug';

export async function getAllBlogs(): Promise<Blog[]> {
  const list = await readList<Blog>(files.blogs);
  return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const list = await readList<Blog>(files.blogs);
  return list.find((b) => b.slug === slug) ?? null;
}

export async function createBlog(input: CreateBlogInput): Promise<Blog> {
  const list = await readList<Blog>(files.blogs);
  const used = new Set(list.map((b) => b.slug));
  const slug = uniqueSlug(input.title, used);

  const now = new Date().toISOString();
  const newBlog: Blog = {
    id: genId('blog'),
    slug,
    title: input.title.trim(),
    imageUrl: input.imageUrl?.trim(),
    content: input.content.trim(),
    categoryIds: Array.from(new Set(input.categoryIds)),
    tagIds: Array.from(new Set(input.tagIds)),
    authorId: input.authorId,
    createdAt: now,
  };

  const next = [newBlog, ...list];
  await writeList(files.blogs, next);
  return newBlog;
}

export async function deleteBlogBySlug(slug: string): Promise<boolean> {
  const list = await readList<Blog>(files.blogs);
  const idx = list.findIndex((b) => b.slug === slug);
  if (idx === -1) return false;
  list.splice(idx, 1);
  await writeList(files.blogs, list);
  return true;
}

