'use client';

import { useState, useEffect, useCallback } from 'react';

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export function usePagination(total: number, initialLimit: number = 20) {
  const [state, setState] = useState<PaginationState>({
    page: 1,
    limit: initialLimit,
    total,
  });

  useEffect(() => {
    setState(prev => ({ ...prev, total }));
  }, [total]);

  const goToPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      page: Math.max(1, Math.min(page, Math.ceil(prev.total / prev.limit))),
    }));
  }, []);

  const nextPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      page: Math.min(prev.page + 1, Math.ceil(prev.total / prev.limit)),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setState(prev => ({
      ...prev,
      limit,
      page: 1,
    }));
  }, []);

  const totalPages = Math.ceil(state.total / state.limit);

  return {
    page: state.page,
    limit: state.limit,
    total: state.total,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    setLimit,
    hasNextPage: state.page < totalPages,
    hasPrevPage: state.page > 1,
    offset: (state.page - 1) * state.limit,
  };
}
