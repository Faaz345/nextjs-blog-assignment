import React from 'react';
import clsx from 'clsx';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
}

export default function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const go = (p: number) => onPageChange(Math.min(pageCount, Math.max(1, p)));

  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(pageCount, start + windowSize - 1);
  const pages = [] as number[];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="mt-6 flex items-center justify-center gap-2">
      <button className="btn btn-secondary px-3 py-2" onClick={() => go(1)} disabled={page === 1}>
        « First
      </button>
      <button className="btn btn-secondary px-3 py-2" onClick={() => go(page - 1)} disabled={page === 1}>
        ‹ Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={clsx('btn px-3 py-2', p === page ? 'btn-primary' : 'btn-secondary')}
          onClick={() => go(p)}
        >
          {p}
        </button>
      ))}
      <button className="btn btn-secondary px-3 py-2" onClick={() => go(page + 1)} disabled={page === pageCount}>
        Next ›
      </button>
      <button className="btn btn-secondary px-3 py-2" onClick={() => go(pageCount)} disabled={page === pageCount}>
        Last »
      </button>
    </nav>
  );
}

