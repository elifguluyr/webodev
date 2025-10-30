// src/pages/WatchList.jsx

import React, { useState, useEffect, useCallback } from 'react';
import ShowCard from '../components/ShowCard.jsx';
import './WatchList.css'; // Stiller için

// TVMaze tek bir dizi bilgisini id ile çekme URL'si
const SINGLE_SHOW_API_URL = 'https://api.tvmaze.com/shows/';

// App.jsx'ten favori ID'leri ve çıkarma fonksiyonunu alıyoruz
const WatchList = ({ watchListIds, removeFromWatchList }) => {
  const [favoriteShows, setFavoriteShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Favori ID'lerini kullanarak dizilerin detaylarını API'den çeken fonksiyon
  const fetchFavoriteShows = useCallback(async () => {
    if (watchListIds.length === 0) {
      setFavoriteShows([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Tüm API isteklerini aynı anda Promise.all ile paralel yapıyoruz
    const promises = watchListIds.map(id => 
      fetch(`${SINGLE_SHOW_API_URL}${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Dizi ID ${id} için yükleme başarısız oldu.`);
          }
          return res.json();
        })
        .catch(err => {
          console.error(err);
          // Hata olsa bile diğer dizilerin çekilmesini engellememek için null döndür
          return null; 
        })
    );
    
    const results = await Promise.all(promises);
    
    // Başarılı dönen sonuçları filtrele
    const validShows = results.filter(show => show !== null);
    
    setFavoriteShows(validShows);
    setLoading(false);

    if (validShows.length !== watchListIds.length) {
      setError("Bazı diziler yüklenirken sorun oluştu veya bulunamadı.");
    }

  }, [watchListIds]); // Sadece watchListIds değiştiğinde yeniden oluşturulur

  useEffect(() => {
    fetchFavoriteShows();
  }, [fetchFavoriteShows]); // Component yüklendiğinde ve list değiştiğinde çalışır


  if (loading) {
    return <div className="loading-message">Favori Diziler Yükleniyor...</div>;
  }

  return (
    <div className="watch-list-page">
      <h2>İzleme Listem ({watchListIds.length})</h2>
      
      {error && <p className="error-message">{error}</p>}

      {watchListIds.length === 0 ? (
        <p className="empty-list-message">İzleme listeniz şu an boş. Ana sayfadan dizileri ekleyebilirsiniz!</p>
      ) : (
        <div className="favorite-shows-grid">
          {favoriteShows.map(show => (
            // İzleme Listesi'nde sadece çıkarma butonu olduğu için isFavorite'i hep true gönder
            <ShowCard 
              key={show.id}
              show={show}
              isFavorite={true} 
              // Favoriden çıkarma fonksiyonunu iletiyoruz
              onToggleFavorite={() => removeFromWatchList(show.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchList;