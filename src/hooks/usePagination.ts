'use client';

import { useMemo } from 'react';

// ============================================================
// Types
// ============================================================

interface UsePaginationParams {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

/** Angka halaman atau '…' sebagai elipsis */
export type PageItem = number | '…';

interface UsePaginationReturn {
  totalPages: number;
  pages: PageItem[];
  canPrevious: boolean;
  canNext: boolean;
  goToPage: (page: number) => number;
}

// ============================================================
// Hook
// ============================================================

export function usePagination({
  totalItems,
  itemsPerPage,
  currentPage,
}: UsePaginationParams): UsePaginationReturn {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const pages = useMemo<PageItem[]>(() => {
    // Jika total halaman ≤ 7, tampilkan semua
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: PageItem[] = [];

    // Selalu tampilkan halaman pertama
    items.push(1);

    if (currentPage > 3) {
      items.push('…');
    }

    // Halaman sekitar currentPage
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      items.push(i);
    }

    if (currentPage < totalPages - 2) {
      items.push('…');
    }

    // Selalu tampilkan halaman terakhir
    items.push(totalPages);

    return items;
  }, [totalPages, currentPage]);

  const canPrevious = currentPage > 1;
  const canNext = currentPage < totalPages;

  /**
   * Kembalikan nomor halaman yang valid (di-clamp ke rentang 1..totalPages).
   */
  function goToPage(page: number): number {
    return Math.min(Math.max(1, page), totalPages);
  }

  return { totalPages, pages, canPrevious, canNext, goToPage };
}
