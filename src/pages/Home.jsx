import React, { useEffect } from 'react';
import Search from '../components/Search.jsx';
import ShowList from '../components/ShowList.jsx'; 
import { actionTypes } from '../state/appReducer.jsx'; 

const Home = ({ state, dispatch, fetchShows }) => { 

  const { shows, watchList, loading, error, searchTerm } = state;

  const handleSearchTermChange = (newTerm) => {
    dispatch({ type: actionTypes.SET_SEARCH_TERM, payload: newTerm });
    fetchShows(newTerm); 
  };

  if (loading && shows.length === 0) {
    return <div className="loading-message">Yükleniyor...</div>;
  }
  
  if (error) {
    return <div className="error-message">Hata: {error}</div>;
  }

  return (
    <div className="home-page">
      <h2>Dizi Ara ve İzleme Listene Ekle</h2>

      <Search 
        initialSearchTerm={searchTerm}
        onSearch={handleSearchTermChange} 
        isLoading={loading}
      />

      <div className="results-area">
        
        {shows.length === 0 ? (
          <p className="no-results">Aradığınız kritere uygun dizi bulunamadı.</p>
        ) : (
          <ShowList 
            state={state} 
            dispatch={dispatch}
          />
        )}
      </div>

    </div>
  );
};

export default Home;