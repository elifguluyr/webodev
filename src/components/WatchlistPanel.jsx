import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { actionTypes } from '../state/appReducer.jsx';
import './WatchlistPanel.css';

const SINGLE_SHOW_API_URL = 'https://api.tvmaze.com/shows/';

const WatchlistPanel = ({ watchListIds, dispatch }) => {
    const [panelShows, setPanelShows] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPanelShows = async () => {
        if (watchListIds.length === 0) {
            setPanelShows([]);
            return;
        }

        setLoading(true);
        try {
            const promises = watchListIds.map(id => 
                axios.get(`${SINGLE_SHOW_API_URL}${id}`).then(res => res.data)
            );
            const results = await Promise.all(promises);
            setPanelShows(results);
        } catch (error) {
            console.error("Panel yüklenirken hata:", error);
            setPanelShows([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPanelShows();
    }, [watchListIds]); 

    const handleRemove = (showId) => {
        dispatch({ type: actionTypes.REMOVE_WATCHLIST, payload: showId });
    };

    const handleClearList = () => {
        if (window.confirm("İzleme listesini tamamen temizlemek istediğinizden emin misiniz?")) {
            dispatch({ type: actionTypes.CLEAR_WATCHLIST });
        }
    };

    return (
        <div className="watchlist-panel">
            <h4>Gösterme Gerekçeler ({watchListIds.length})</h4>
            
            {loading && <p>Yükleniyor...</p>}
            
            {!loading && watchListIds.length === 0 ? (
                <p className="empty-message">Listeye eklenmiş yapım yok.</p>
            ) : (
                <>
                    <div className="panel-list">
                        {panelShows.map(show => (
                            <div key={show.id} className="panel-item">
                                <img 
                                    src={show.image?.medium || 'https://via.placeholder.com/50x70?text=P'} 
                                    alt={show.name} 
                                    className="panel-image"
                                />
                                <div className="panel-details">
                                    <span className="panel-title">{show.name}</span>
                                    <span className="panel-rating">⭐ {show.rating?.average || 'N/A'}</span>
                                </div>
                                <button 
                                    className="panel-remove-btn" 
                                    onClick={() => handleRemove(show.id)}
                                >
                                    Kaldır
                                </button>
                            </div>
                        ))}
                    </div>

                    {watchListIds.length > 0 && (
                        <button className="clear-list-btn" onClick={handleClearList}>
                            Listeyi Temizle
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default WatchlistPanel;