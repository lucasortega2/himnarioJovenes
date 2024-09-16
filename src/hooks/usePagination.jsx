import { useState } from 'react';
const usePagination = (filteredHimnos) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 8;
  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentHymns = filteredHimnos.slice(firstPostIndex, lastPostIndex);
  return {
    currentHymns,
    postPerPage,
    setCurrentPage,
    currentPage,
  };
};

export default usePagination;
