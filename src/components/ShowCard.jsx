import React from 'react';
import './ShowCard.css'; 

const ShowCard = ({ show, isFavorite, onToggleFavorite }) => {
    
  const imageUrl = show.image?.medium || 'https://via.placeholder.com/210x295?text=Poster+Yok';
  const summary = show.summary 
    ? show.summary.replace(/<[^>]+>/g, '').substring(0, 150) + '...' 
    : 'Özet bulunmamaktadır.';
  const genres = show.genres?.join(', ') || 'Belirtilmemiş';
  const rating = show.rating?.average || 'N/A';

  const handleToggle = () => {
    onToggleFavorite(show.id);
  };

  return (
    <div className="show-card">
      <img src={imageUrl} alt={show.name} className="show-image" />
      <div className="show-details">
        <h3>{show.name}</h3>
        <p className="show-info">
          Türler: <strong>{genres}</strong> | Puan: <strong>{rating}</strong>
        </p>
        <p className="show-summary">{summary}</p>
        
        <div className="card-actions">
            <button 
                className="detail-btn"
                onClick={() => window.location.pathname = `/show/${show.id}`}
            >
                Detay
            </button>

            <button 
                className={`favorite-btn ${isFavorite ? 'remove' : 'add'}`}
                onClick={handleToggle}
            >
                {isFavorite ? 'Listeden Çıkar' : 'Gösterime Ekle'}
            </button>
        </div>
        
      </div>
    </div>
  );
};

export default ShowCard;