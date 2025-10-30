import React, { useState, useMemo } from 'react';
import ShowCard from './ShowCard.jsx';
import Pagination from './Pagination.jsx'; 
import WatchlistPanel from './WatchlistPanel.jsx'; 
import { actionTypes } from '../state/appReducer.jsx';
import './ShowList.css';

const ShowList = ({ state, dispatch }) => {
    const { shows, watchList, filters, currentPage, pageSize } = state; 
    const handleToggleFavorite = (showId) => {
        const action = watchList.includes(showId)
            ? { type: actionTypes.REMOVE_WATCHLIST, payload: showId }
            : { type: actionTypes.ADD_WATCHLIST, payload: showId };
        
        dispatch(action);
    };

    const { allGenres, allLanguages } = useMemo(() => {
        const genresSet = new Set();
        const languagesSet = new Set();
        shows.forEach(show => {
            show.genres?.forEach(genre => genresSet.add(genre));
            if (show.language) languagesSet.add(show.language);
        });
        return { 
            allGenres: Array.from(genresSet).sort(),
            allLanguages: Array.from(languagesSet).sort()
        };
    }, [shows]);

    const filteredShows = useMemo(() => {
        return shows.filter(show => {
            if (filters.genre && !show.genres?.includes(filters.genre)) {
                return false;
            }
            if (filters.language && show.language !== filters.language) {
                return false;
            }
            const rating = show.rating?.average || 0;
            if (rating < filters.minRating) { 
                return false;
            }
            return true;
        });
    }, [shows, filters]);

    const totalPages = Math.ceil(filteredShows.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentShows = filteredShows.slice(startIndex, startIndex + pageSize);

    const handleFilterChange = (name, value) => {
        dispatch({
            type: actionTypes.SET_FILTERS,
            payload: { [name]: value }
        });
    };
    
    const handlePageChange = (newPage) => {
        dispatch({ type: actionTypes.SET_PAGE, payload: newPage });
    };

    return (
        <div className="show-list-page">

            <div className="filter-panel">
                <button 
                    className="reset-button"
                    onClick={() => dispatch({ 
                        type: actionTypes.SET_FILTERS, 
                        payload: { genre: '', language: '', minRating: 0 } 
                    })}
                >
                    Sıfırla
                </button>

                <select 
                    value={filters.genre} 
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                >
                    <option value="">Tür (hepsi)</option>
                    {allGenres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                    ))}
                </select>

                 <select 
                    value={filters.language} 
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                >
                    <option value="">Dil (hepsi)</option>
                    {allLanguages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>

                <select 
                    value={filters.minRating} 
                    onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                >
                    <option value={0}>Min. Puan (0+)</option>
                    <option value={7}>7+</option>
                    <option value={8}>8+</option>
                    <option value={9}>9+</option>
                </select>
            </div>

            <div className="show-list-main-content">

                <div className="show-list-grid">
                    {currentShows.length > 0 ? (
                        currentShows.map(show => (
                            <ShowCard 
                                key={show.id}
                                show={show}
                                isFavorite={watchList.includes(show.id)}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))
                    ) : (
                        <p className="no-results">Filtrelere uygun sonuç bulunamadı.</p>
                    )}
                </div>

                <WatchlistPanel watchListIds={watchList} dispatch={dispatch} />
                
            </div>

            {filteredShows.length > pageSize && (
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default ShowList;