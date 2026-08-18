import { useState } from 'react';

import type { DataTableServerSide } from 'components/MainTableServerSide/DataTableServerSide';
import type { SortParam } from 'shared/types/api-reponse';

type UseTableServerSideReturn = {
  page: number;
  pageSize: number;
  search: string;
  sortBy: SortParam[];
  serverSideProps: Omit<DataTableServerSide, 'totalRows'>;
  resetPage: () => void;
  resetAll: () => void;
};

export function useTableServerSide(initialPageSize = 10, initialSortBy: SortParam[] = []): UseTableServerSideReturn {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortParam[]>(initialSortBy);

  const serverSideProps: Omit<DataTableServerSide, 'totalRows'> = {
    page,
    pageSize,
    search,
    sortBy,
    onPageChange: (p, ps) => {
      setPage(p);
      setPageSize(ps);
    },
    onSearchChange: (q) => {
      setSearch(q);
      setPage(1);
    },
    onSortChange: (s) => {
      setSortBy(s);
      setPage(1);
    },
  };

  const resetAll = () => {
    setPage(1);
    setSearch('');
    setSortBy(initialSortBy);
  };

  return { page, pageSize, search, sortBy, serverSideProps, resetPage: () => setPage(1), resetAll };
}
