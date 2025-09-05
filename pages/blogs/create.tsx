import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Input from '@/components/forms/Input';
import Textarea from '@/components/forms/Textarea';
import MultiSelect from '@/components/forms/MultiSelect';
import Select from '@/components/forms/Select';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchCategories, createCategoryAsync } from '@/store/slices/categoriesSlice';
import { fetchTags, createTagAsync } from '@/store/slices/tagsSlice';
import { fetchAuthors, createAuthorAsync } from '@/store/slices/authorsSlice';
import type { ID } from '@/lib/types';

export default function CreateBlogPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const categoriesState = useAppSelector((s) => s.categories);
  const tagsState = useAppSelector((s) => s.tags);
  const authorsState = useAppSelector((s) => s.authors);

  useEffect(() => {
    if (categoriesState.status === 'idle') dispatch(fetchCategories());
    if (tagsState.status === 'idle') dispatch(fetchTags());
    if (authorsState.status === 'idle') dispatch(fetchAuthors());
  }, [dispatch, categoriesState.status, tagsState.status, authorsState.status]);

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [categoryIds, setCategoryIds] = useState<ID[]>([]);
  const [tagIds, setTagIds] = useState<ID[]>([]);
  const [authorId, setAuthorId] = useState<ID | ''>('');
  const [submitting, setSubmitting] = useState(false);

  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const action = await dispatch(createCategoryAsync(newCategory));
    const cat = action.payload as { id: ID; name: string };
    setCategoryIds((prev) => Array.from(new Set([...prev, cat.id])));
    setNewCategory('');
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    const action = await dispatch(createTagAsync(newTag));
    const tag = action.payload as { id: ID; name: string };
    setTagIds((prev) => Array.from(new Set([...prev, tag.id])));
    setNewTag('');
  };

  const addAuthor = async () => {
    if (!newAuthor.trim()) return;
    const action = await dispatch(createAuthorAsync({ name: newAuthor }));
    const author = action.payload as { id: ID; name: string };
    setAuthorId(author.id);
    setNewAuthor('');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !authorId) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          imageUrl: imageUrl.trim() || undefined,
          content: content.trim(),
          categoryIds,
          tagIds,
          authorId,
        }),
      });
      if (!res.ok) throw new Error('Failed to create blog');
      const json = await res.json();
      const blog = json.data as { slug: string };
      router.push(`/blogs/${blog.slug}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <form onSubmit={onSubmit} className="card p-5 space-y-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
        <Textarea label="Content" value={content} onChange={(e) => setContent(e.target.value)} required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <MultiSelect
              label="Categories"
              options={categoriesState.items.map((c) => ({ label: c.name, value: c.id }))}
              values={categoryIds}
              onChange={setCategoryIds}
            />
            <div className="mt-2 flex gap-2">
              <Input placeholder="New category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
              <button type="button" className="btn btn-secondary" onClick={addCategory}>Add</button>
            </div>
          </div>

          <div>
            <MultiSelect
              label="Tags"
              options={tagsState.items.map((t) => ({ label: t.name, value: t.id }))}
              values={tagIds}
              onChange={setTagIds}
            />
            <div className="mt-2 flex gap-2">
              <Input placeholder="New tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
              <button type="button" className="btn btn-secondary" onClick={addTag}>Add</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Author"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value as ID)}
            required
            options={[{ label: 'Select an author…', value: '' }, ...authorsState.items.map((a) => ({ label: a.name, value: a.id }))]}
          />
          <div>
            <Input label="Add new author" placeholder="Author name" value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} />
            <button type="button" className="btn btn-secondary mt-2" onClick={addAuthor}>Add Author</button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/blogs')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>Create</button>
        </div>
      </form>
    </div>
  );
}

