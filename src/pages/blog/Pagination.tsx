// src/pages/blog/Pagination.tsx

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center mt-12">
      <div className="inline-flex space-x-2">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-4 py-2 rounded-md border ${
                page === currentPage
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Pagination;
