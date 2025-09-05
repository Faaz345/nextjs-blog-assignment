import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, easeOut } from 'framer-motion';
import { Clock, User, Tag, Trash2, Edit, ArrowRight } from 'lucide-react';
import type { Blog, Category, Tag as TagType, Author } from '@/lib/types';
import { excerpt } from '@/lib/utils/excerpt';
import { Chip, ChipGroup } from '@/components/ui/Chip';

interface BlogCardProps {
  blog: Blog;
  categories: Category[];
  tags: TagType[];
  author: Author | undefined;
  onDelete?: (slug: string) => void;
  index?: number;
}

export default function EnhancedBlogCard({ 
  blog, 
  categories, 
  tags, 
  author, 
  onDelete,
  index = 0 
}: BlogCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: easeOut
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      className="group card overflow-hidden bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-accent-purple/20 dark:from-primary-900/20 dark:to-accent-purple/10">
        {blog.imageUrl ? (
          <motion.div
            whileHover="hover"
            variants={imageVariants}
            className="relative w-full h-full"
          >
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary-400 to-accent-purple flex items-center justify-center">
                <Tag className="w-8 h-8 text-white" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">No image</p>
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <div className="absolute top-3 left-3">
            <ChipGroup>
              {categories.slice(0, 2).map((cat) => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  variant="primary"
                  size="sm"
                  className="backdrop-blur-sm bg-white/90 dark:bg-dark-900/90"
                />
              ))}
              {categories.length > 2 && (
                <Chip
                  label={`+${categories.length - 2}`}
                  variant="default"
                  size="sm"
                  className="backdrop-blur-sm bg-white/90 dark:bg-dark-900/90"
                />
              )}
            </ChipGroup>
          </div>
        )}

        {onDelete && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white/90 dark:bg-dark-900/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-dark-800 transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(blog.slug)}
              className="p-2 rounded-full bg-red-500/90 backdrop-blur-sm text-white hover:bg-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 line-clamp-2 transition-colors">
          <Link 
            href={`/blogs/${blog.slug}`}
            className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
          >
            {blog.title}
          </Link>
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
          {excerpt(blog.content, 30)}
        </p>

        {tags.length > 0 && (
          <div className="mb-4">
            <ChipGroup>
              {tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag.id}
                  label={`#${tag.name}`}
                  variant="default"
                  size="sm"
                />
              ))}
              {tags.length > 3 && (
                <Chip
                  label={`+${tags.length - 3}`}
                  variant="default"
                  size="sm"
                />
              )}
            </ChipGroup>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-700">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-purple flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">{author?.name || 'Unknown'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <Link
            href={`/blogs/${blog.slug}`}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <motion.div
              className="flex items-center gap-1 text-sm font-medium"
              whileHover={{ x: 5 }}
            >
              <span>Read</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
