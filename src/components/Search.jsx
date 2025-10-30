import React, { useState } from 'react';
import './Search.css'; 

const Search = ({ initialSearchTerm, onSearch, isLoading }) => {
  const [term, setTerm] = useState(initialSearchTerm);

  const handleInputChange = (event) => {
    setTerm(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault(); 
    const query = term.trim();
    if (query !== '') {
        onSearch(query); 
    }
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Dizi Adını Girin (Örn: Game of Thrones, Friends)"
          value={term}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Aranıyor...' : 'Ara'}
        </button>
      </form>
    </div>
  );
};

export default Search;