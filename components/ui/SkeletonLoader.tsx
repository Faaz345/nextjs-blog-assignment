import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseClass = 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-dark-700 dark:via-dark-600 dark:to-dark-700 bg-[length:1000px_100%]';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl',
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={clsx(baseClass, variantClasses[variant], className)}
      style={{
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'circular' ? '40px' : variant === 'card' ? '200px' : '16px'),
      }}
    />
  ));

  return count > 1 ? <div className="space-y-2">{skeletons}</div> : skeletons[0];
}

export function BlogCardSkeleton() {
  return (
    <article className="card overflow-hidden">
      <Skeleton variant="rectangular" height={192} />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" height={24} width="80%" />
        <Skeleton variant="text" count={2} />
        <div className="flex gap-2">
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={60} height={20} />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="text" width={100} />
        </div>
      </div>
    </article>
  );
}

export function BlogListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }, (_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
