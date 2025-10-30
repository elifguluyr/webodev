// src/pages/ShowDetail.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './ShowDetail.css';

const SHOW_API = 'https://api.tvmaze.com/shows/';
const EPISODES_API_SUFFIX = '/episodes';

const ShowDetail = () => {
    // URL'den dizi ID'sini alıyoruz (Örn: /show/24 -> 24)
    const showId = window.location.pathname.split('/').pop();

    const [show, setShow] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dizi ve Bölüm verilerini çekme (Axios ile)
    const fetchData = useCallback(async () => {
        if (!showId || isNaN(showId)) {
            setError("Geçersiz Dizi ID'si.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            // 1. Dizi Detay Bilgilerini Çekme
            const showPromise = axios.get(`${SHOW_API}${showId}`);

            // 2. Bölüm Listesini Çekme (Ayrı bir API çağrısı)
            const episodesPromise = axios.get(`${SHOW_API}${showId}${EPISODES_API_SUFFIX}`);
            
            // İki isteği Promise.all ile paralel çalıştır
            const [showResponse, episodesResponse] = await Promise.all([showPromise, episodesPromise]);

            setShow(showResponse.data);
            setEpisodes(episodesResponse.data);
            setLoading(false);

        } catch (err) {
            setError("Dizi detayları yüklenirken bir hata oluştu. (API bağlantı hatası veya dizi bulunamadı)");
            setLoading(false);
        }
    }, [showId]); 

    useEffect(() => {
        fetchData();
    }, [fetchData]); 

    if (loading) {
        return <div className="detail-loading">Detaylar Yükleniyor...</div>;
    }

    if (error) {
        return <div className="detail-error">{error}</div>;
    }
    
    // Özet temizleme ve formatlama (HTML etiketlerini kaldırır)
    const cleanSummary = show.summary ? show.summary.replace(/<[^>]+>/g, '') : 'Özet bulunmamaktadır.';
    const rating = show.rating?.average || 'N/A';
    const premiere = show.premiered ? new Date(show.premiered).toLocaleDateString() : 'Bilinmiyor';

    // Bölümleri Sezonlara Göre Gruplama (IMG_1311.jpg görseline uygun)
    const groupedEpisodes = episodes.reduce((acc, episode) => {
        const season = `S${episode.season}`;
        if (!acc[season]) {
            acc[season] = [];
        }
        acc[season].push(episode);
        return acc;
    }, {});

    return (
        <div className="show-detail-container">
            {/* Geri Butonu */}
            <button className="back-button" onClick={() => window.history.back()}>
                ← Geri
            </button>
            
            <div className="detail-header">
                <img 
                    src={show.image?.medium || 'https://via.placeholder.com/250x350?text=Poster+Yok'} 
                    alt={show.name} 
                    className="detail-image" 
                />
                
                <div className="detail-info">
                    <h1>{show.name}</h1>
                    <div className="tags">
                        {show.genres?.map(g => <span key={g} className="tag">{g}</span>)}
                        <span className="tag">{show.language}</span>
                        <span className="tag star">⭐ {rating}</span>
                        <span className="tag">{show.runtime || '--'} dk</span>
                    </div>
                    <p className="detail-summary">{cleanSummary}</p>
                    <p className="detail-meta">Başlangıç Tarihi: <strong>{premiere}</strong></p>
                </div>
            </div>

            <div className="detail-episodes">
                <h2>Bölümler ({episodes.length})</h2>
                {Object.entries(groupedEpisodes).map(([season, epList]) => (
                    <div key={season} className="season-group">
                        <h3>{season} - Sezonu</h3>
                        {epList.map(ep => (
                            <div key={ep.id} className="episode-item">
                                <span className="ep-title">{ep.season}x{ep.number} - {ep.name}</span>
                                {/* API'de süre verisi varsa gösterilir */}
                                <span className="ep-runtime">{ep.runtime ? `${ep.runtime} dk` : '--'}</span> 
                                {/* Kaynak butonu ödev görselinde olmasına rağmen, API tam URL vermediği için sadece yer tutucu bıraktık */}
                                <button className="source-button">Kaynak</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowDetail;