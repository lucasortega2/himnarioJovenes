import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const Pagination = ({
  totalPost,
  postPerPage,
  setCurrentPage,
  currentPage,
}) => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const totalPages = Math.ceil(totalPost / postPerPage);
    let pageArray = [];

    if (totalPages <= 7) {
      pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 4) {
        pageArray = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (currentPage >= totalPages - 3) {
        pageArray = [
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        pageArray = [
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        ];
      }
    }

    setPages(pageArray);
  }, [totalPost, postPerPage, currentPage]);

  const handlePageChange = (page) => {
    if (typeof page === 'number') {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(totalPost / postPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={handlePrevious}
        className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors disabled:opacity-50"
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      {pages.map((page, index) => {
        return (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className={`w-8 h-8 rounded-full ${
              page === currentPage
                ? 'bg-white text-blue-600'
                : 'bg-white bg-opacity-20 text-white'
            } hover:bg-opacity-30 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              page === '...' ? 'cursor-default' : ''
            }`}
            disabled={page === '...'}
          >
            {page}
          </button>
        );
      })}
      <button
        onClick={handleNext}
        className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors disabled:opacity-50"
        disabled={currentPage === Math.ceil(totalPost / postPerPage)}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
