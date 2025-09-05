import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchBlogs, deleteBlog } from '@/store/slices/blogsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { fetchTags } from '@/store/slices/tagsSlice';
import { fetchAuthors } from '@/store/slices/authorsSlice';
import EnhancedFilters from '@/components/blog/EnhancedFilters';
import EnhancedBlogCard from '@/components/blog/EnhancedBlogCard';
import Pagination from '@/components/common/Pagination';
import { BlogListSkeleton } from '@/components/ui/SkeletonLoader';
import { setAuthorId, setCategoryIds, setPage, setQuery, setSort, setTagIds } from '@/store/slices/filtersSlice';
import type { Blog, Category, ID, SortBy, SortOrder, Tag } from '@/lib/types';
import { TrendingUp, BookOpen, Calendar } from 'lucide-react';

const ConfirmModal = dynamic(() => import('@/components/common/ConfirmModal'), { ssr: false });

const PAGE_SIZE = 6;

export default function EnhancedBlogsListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { items: blogs, status: blogsStatus } = useAppSelector((s) => s.blogs);
  const { items: categories } = useAppSelector((s) => s.categories);
  const { items: tags } = useAppSelector((s) => s.tags);
  const { items: authors } = useAppSelector((s) => s.authors);
  const filters = useAppSelector((s) => s.filters);

  const [toDelete, setToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (blogsStatus === 'idle') await dispatch(fetchBlogs());
        await Promise.all([
          dispatch(fetchCategories()),
          dispatch(fetchTags()),
          dispatch(fetchAuthors())
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dispatch, blogsStatus]);

  const hydratedFromUrl = useRef(false);
  useEffect(() => {
    if (hydratedFromUrl.current) return;
    const { q, categories: c, tags: t, author, sort, order, page } = router.query;

    if (typeof q === 'string') dispatch(setQuery(q));
    if (typeof c === 'string' && c) dispatch(setCategoryIds(c.split(',')));
    if (typeof t === 'string' && t) dispatch(setTagIds(t.split(',')));
    if (typeof author === 'string' && author) dispatch(setAuthorId(author));

    const sortBy: SortBy = sort === 'title' ? 'title' : 'date';
    const sortOrder: SortOrder = order === 'asc' ? 'asc' : 'desc';
    dispatch(setSort({ sortBy, sortOrder }));

    const pageNum = parseInt(String(page ?? '1'), 10);
    if (!Number.isNaN(pageNum)) dispatch(setPage(Math.max(1, pageNum)));

    hydratedFromUrl.current = true;
  }, [dispatch, router.query]);

  useEffect(() => {
    if (!hydratedFromUrl.current) return;
    const query: Record<string, string> = {};
    if (filters.q) query.q = filters.q;
    if (filters.categoryIds.length) query.categories = filters.categoryIds.join(',');
    if (filters.tagIds.length) query.tags = filters.tagIds.join(',');
    if (filters.authorId) query.author = filters.authorId;
    query.sort = filters.sortBy;
    query.order = filters.sortOrder;
    if (filters.page && filters.page !== 1) query.page = String(filters.page);

    const current = router.asPath.split('?')[1] ?? '';
    const next = new URLSearchParams(query).toString();
    if (current !== next) {
      router.replace({ pathname: '/blogs', query }, undefined, { shallow: true });
    }
  }, [filters, router]);

  const { pageItems, total } = useMemo(() => {
    const lc = filters.q.trim().toLowerCase();
    const hasSearch = lc.length > 0;
    const hasCat = filters.categoryIds.length > 0;
    const hasTag = filters.tagIds.length > 0;
    const hasAuthor = !!filters.authorId;

    const filtered = blogs.filter((b) => {
      if (hasSearch) {
        const hay = (b.title + ' ' + b.content).toLowerCase();
        if (!hay.includes(lc)) return false;
      }
      if (hasCat) {
        const set = new Set(b.categoryIds);
        const intersects = filters.categoryIds.some((id) => set.has(id));
        if (!intersects) return false;
      }
      if (hasTag) {
        const set = new Set(b.tagIds);
        const intersects = filters.tagIds.some((id) => set.has(id));
        if (!intersects) return false;
      }
      if (hasAuthor && b.authorId !== filters.authorId) return false;
      return true;
    });

    const sorted = filtered.sort((a, b) => {
      if (filters.sortBy === 'date') {
        const delta = a.createdAt.localeCompare(b.createdAt);
        return filters.sortOrder === 'asc' ? delta : -delta;
      }
      const delta = a.title.localeCompare(b.title);
      return filters.sortOrder === 'asc' ? delta : -delta;
    });

    const start = (filters.page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return { pageItems: sorted.slice(start, end), total: sorted.length };
  }, [blogs, filters]);

  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const tagMap = useMemo(() => Object.fromEntries(tags.map((t) => [t.id, t])), [tags]);
  const authorMap = useMemo(() => Object.fromEntries(authors.map((a) => [a.id, a])), [authors]);

  const handleDelete = (slug: string) => {
    setToDelete(slug);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await dispatch(deleteBlog(toDelete));
      toast.success('Blog deleted successfully');
      setToDelete(null);
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  const stats = useMemo(() => {
    const totalBlogs = blogs.length;
    const totalAuthors = authors.length;
    const recentBlogs = blogs.filter(b => {
      const date = new Date(b.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date > weekAgo;
    }).length;

    return { totalBlogs, totalAuthors, recentBlogs };
  }, [blogs, authors]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-purple p-8 text-white"
      >
        <div className="absolute inset-0 bg-gradient-shine opacity-50" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">Explore Amazing Blogs</h1>
          <p className="text-lg text-primary-100 mb-6">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
          
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-200" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalBlogs}</p>
                  <p className="text-xs text-primary-200">Total Blogs</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-200" />
                <div>
                  <p className="text-2xl font-bold">{stats.recentBlogs}</p>
                  <p className="text-xs text-primary-200">This Week</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-200" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalAuthors}</p>
                  <p className="text-xs text-primary-200">Authors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-purple/20 rounded-full blur-3xl" />
      </motion.div>

      <EnhancedFilters
        q={filters.q}
        setQ={(v) => dispatch(setQuery(v))}
        categories={categories}
        tags={tags}
        authors={authors}
        selectedCategoryIds={filters.categoryIds}
        setSelectedCategoryIds={(ids) => dispatch(setCategoryIds(ids))}
        selectedTagIds={filters.tagIds}
        setSelectedTagIds={(ids) => dispatch(setTagIds(ids))}
        selectedAuthorId={filters.authorId}
        setSelectedAuthorId={(id) => dispatch(setAuthorId(id))}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSortChange={(payload) => dispatch(setSort(payload))}
      />

      <div className="flex items-center justify-between">
        <motion.p
          key={total}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Found <span className="font-semibold text-gray-900 dark:text-gray-100">{total}</span> {total === 1 ? 'result' : 'results'}
        </motion.p>
      </div>

      {isLoading ? (
        <BlogListSkeleton />
      ) : pageItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-dark-800 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No blogs found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search query
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={filters.page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {pageItems.map((blog, index) => (
              <EnhancedBlogCard
                key={blog.id}
                blog={blog}
                categories={blog.categoryIds.map((id) => catMap[id]).filter(Boolean) as Category[]}
                tags={blog.tagIds.map((id) => tagMap[id]).filter(Boolean) as Tag[]}
                author={authorMap[blog.authorId]}
                onDelete={handleDelete}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {total > PAGE_SIZE && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Pagination
            page={filters.page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={(p) => dispatch(setPage(p))}
          />
        </motion.div>
      )}

      {toDelete && (
        <ConfirmModal
          title="Delete Blog"
          message="Are you sure you want to delete this blog? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
