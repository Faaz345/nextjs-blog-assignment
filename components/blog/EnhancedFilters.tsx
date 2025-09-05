import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, SortAsc, SortDesc } from 'lucide-react';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import type { Author, Category, SortBy, SortOrder, Tag } from '@/lib/types';
import clsx from 'clsx';

interface EnhancedFiltersProps {
  q: string;
  setQ: (q: string) => void;
  categories: Category[];
  tags: Tag[];
  authors: Author[];
  selectedCategoryIds: string[];
  setSelectedCategoryIds: (ids: string[]) => void;
  selectedTagIds: string[];
  setSelectedTagIds: (ids: string[]) => void;
  selectedAuthorId: string | null;
  setSelectedAuthorId: (id: string | null) => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (payload: { sortBy: SortBy; sortOrder: SortOrder }) => void;
}

export default function EnhancedFilters({
  q,
  setQ,
  categories,
  tags,
  authors,
  selectedCategoryIds,
  setSelectedCategoryIds,
  selectedTagIds,
  setSelectedTagIds,
  selectedAuthorId,
  setSelectedAuthorId,
  sortBy,
  sortOrder,
  onSortChange,
}: EnhancedFiltersProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const clearAllFilters = () => {
    setQ('');
    setSelectedCategoryIds([]);
    setSelectedTagIds([]);
    setSelectedAuthorId(null);
  };

  const hasActiveFilters = 
    q.length > 0 || 
    selectedCategoryIds.length > 0 || 
    selectedTagIds.length > 0 || 
    selectedAuthorId !== null;

  return (
    <div className="sticky top-20 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-dark-700 shadow-sm">
      <div className="space-y-4">
        <div className="relative">
          <motion.div
            animate={{ scale: searchFocused ? 1.02 : 1 }}
            className={clsx(
              "relative rounded-xl transition-all duration-300",
              searchFocused && "shadow-lg shadow-primary-500/20"
            )}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search blogs by title or content..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <button
                onClick={() => toggleSection('categories')}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                  selectedCategoryIds.length > 0
                    ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                    : "border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800"
                )}
              >
                <Filter className="w-4 h-4" />
                <span>Categories</span>
                {selectedCategoryIds.length > 0 && (
                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-primary-600 text-white">
                    {selectedCategoryIds.length}
                  </span>
                )}
                <ChevronDown className={clsx(
                  "w-4 h-4 transition-transform",
                  expandedSection === 'categories' && "rotate-180"
                )} />
              </button>
              
              <AnimatePresence>
                {expandedSection === 'categories' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 w-64 p-3 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-dark-700 z-50"
                  >
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {categories.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategoryIds.includes(cat.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategoryIds([...selectedCategoryIds, cat.id]);
                              } else {
                                setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== cat.id));
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => toggleSection('tags')}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                  selectedTagIds.length > 0
                    ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                    : "border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800"
                )}
              >
                <Filter className="w-4 h-4" />
                <span>Tags</span>
                {selectedTagIds.length > 0 && (
                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-primary-600 text-white">
                    {selectedTagIds.length}
                  </span>
                )}
                <ChevronDown className={clsx(
                  "w-4 h-4 transition-transform",
                  expandedSection === 'tags' && "rotate-180"
                )} />
              </button>
              
              <AnimatePresence>
                {expandedSection === 'tags' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 w-64 p-3 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-dark-700 z-50"
                  >
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {tags.map((tag) => (
                        <label
                          key={tag.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTagIds.includes(tag.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTagIds([...selectedTagIds, tag.id]);
                              } else {
                                setSelectedTagIds(selectedTagIds.filter(id => id !== tag.id));
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm">#{tag.name}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => toggleSection('author')}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                  selectedAuthorId
                    ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                    : "border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800"
                )}
              >
                <Filter className="w-4 h-4" />
                <span>Author</span>
                <ChevronDown className={clsx(
                  "w-4 h-4 transition-transform",
                  expandedSection === 'author' && "rotate-180"
                )} />
              </button>
              
              <AnimatePresence>
                {expandedSection === 'author' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 w-64 p-3 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-dark-700 z-50"
                  >
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {authors.map((author) => (
                        <button
                          key={author.id}
                          onClick={() => setSelectedAuthorId(selectedAuthorId === author.id ? null : author.id)}
                          className={clsx(
                            "w-full text-left p-2 rounded-lg transition-colors",
                            selectedAuthorId === author.id
                              ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                              : "hover:bg-gray-50 dark:hover:bg-dark-700"
                          )}
                        >
                          <span className="text-sm">{author.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <select
              value={sortBy}
              onChange={(e) => onSortChange({ sortBy: e.target.value as SortBy, sortOrder })}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => onSortChange({ sortBy, sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' })}
              className="p-2 rounded-lg border border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
              aria-label="Toggle sort order"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            <ChipGroup>
              {q && (
                <Chip
                  label={`Search: "${q}"`}
                  onRemove={() => setQ('')}
                  variant="primary"
                />
              )}
              {selectedCategoryIds.map(id => {
                const cat = categories.find(c => c.id === id);
                return cat ? (
                  <Chip
                    key={id}
                    label={cat.name}
                    onRemove={() => setSelectedCategoryIds(selectedCategoryIds.filter(cId => cId !== id))}
                    variant="primary"
                  />
                ) : null;
              })}
              {selectedTagIds.map(id => {
                const tag = tags.find(t => t.id === id);
                return tag ? (
                  <Chip
                    key={id}
                    label={`#${tag.name}`}
                    onRemove={() => setSelectedTagIds(selectedTagIds.filter(tId => tId !== id))}
                    variant="success"
                  />
                ) : null;
              })}
              {selectedAuthorId && (
                <Chip
                  label={authors.find(a => a.id === selectedAuthorId)?.name || ''}
                  onRemove={() => setSelectedAuthorId(null)}
                  variant="warning"
                />
              )}
            </ChipGroup>
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
            >
              Clear All
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
