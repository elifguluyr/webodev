// src/components/Pagination.jsx

import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    
    return (
        <div className="pagination-container">
  
            <button 
                onClick={() => onPageChange(1)} 
                disabled={currentPage === 1}
            >
                İlk
            </button>

            <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1}
            >
                Geri
            </button>

            <div className="page-numbers">
                {pageNumbers.map(number => (
                    <button 
                        key={number}
                        className={number === currentPage ? 'active' : ''}
                        onClick={() => onPageChange(number)}
                    >
                        {number}
                    </button>
                ))}
            </div>

            <button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
            >
                Sonraki
            </button>

            <button 
                onClick={() => onPageChange(totalPages)} 
                disabled={currentPage === totalPages}
            >
                Son
            </button>
        </div>
    );
};

export default Pagination;