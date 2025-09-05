import React, { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getBlogBySlug } from '@/lib/data/blogService';
import { getAllCategories } from '@/lib/data/categoryService';
import { getAllTags } from '@/lib/data/tagService';
import { getAllAuthors } from '@/lib/data/authorService';
import type { Author, Blog, Category, ExpandedBlog, Tag } from '@/lib/types';
import { excerpt } from '@/lib/utils/excerpt';
import { useRouter } from 'next/router';

const ConfirmModal = dynamic(() => import('@/components/common/ConfirmModal'), { ssr: false });

interface BlogDetailProps {
  expanded: ExpandedBlog;
}

export default function BlogDetailPage({ expanded }: BlogDetailProps) {
  const router = useRouter();
  const { blog, categories, tags, author } = expanded;
  const [confirming, setConfirming] = useState(false);

  const onDelete = async () => {
    const res = await fetch(`/api/blogs/${encodeURIComponent(blog.slug)}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/blogs');
    }
  };

  return (
    <article className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{blog.title}</h1>
        <div className="flex items-center gap-2">
          <Link href="/blogs" className="btn btn-secondary">Back</Link>
          <button className="btn btn-danger" onClick={() => setConfirming(true)}>Delete</button>
        </div>
      </div>

      {blog.imageUrl && (
        <div className="relative h-64 w-full rounded-lg overflow-hidden">
          <Image src={blog.imageUrl} alt={blog.title} fill className="object-cover" />
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-sm">
        {categories.map((c) => (
          <span key={c.id} className="rounded-full bg-gray-100 px-2 py-1 text-gray-800">{c.name}</span>
        ))}
        {tags.map((t) => (
          <span key={t.id} className="rounded-full bg-primary-100 text-primary-700 px-2 py-1">#{t.name}</span>
        ))}
      </div>

      <div className="text-sm text-gray-600">
        <span>By {author.name} • {new Date(blog.createdAt).toLocaleString()}</span>
      </div>

      <div className="prose prose-sm sm:prose" dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }} />

      {confirming && (
        <ConfirmModal
          title="Delete Blog"
          message={"Are you sure you want to delete '" + blog.title + "'? This action cannot be undone."}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={onDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </article>
  );
}

export const getServerSideProps: GetServerSideProps<BlogDetailProps> = async (ctx) => {
  const slug = ctx.params?.slug as string;
  const blog = await getBlogBySlug(slug);
  if (!blog) {
    return { notFound: true };
  }
  const [categories, tags, authors] = await Promise.all([
    getAllCategories(),
    getAllTags(),
    getAllAuthors(),
  ]);
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const tagMap = new Map(tags.map((t) => [t.id, t]));
  const author = authors.find((a) => a.id === blog.authorId)!;

  const expanded: ExpandedBlog = {
    blog,
    categories: blog.categoryIds.map((id) => catMap.get(id)).filter(Boolean) as Category[],
    tags: blog.tagIds.map((id) => tagMap.get(id)).filter(Boolean) as Tag[],
    author,
  };

  return { props: { expanded } };
};

