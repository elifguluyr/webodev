// src/App.jsx

import React, { useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import WatchList from './pages/WatchList.jsx'; 
import ShowDetail from './pages/ShowDetail.jsx'; // 👈 Detay sayfasını import et
import { appReducer, initialState, actionTypes } from './state/appReducer.jsx'; // Uzantı .jsx
import './App.css'; 

const WATCH_LIST_STORAGE_KEY = 'kampusFilmWatchList';
const API_URL = 'https://api.tvmaze.com/search/shows?q=';

function App() {
  
  // Local Storage'dan yüklenen ilk WatchList'i kullanıyoruz
  const initialWatchList = (() => {
    try {
      const storedList = localStorage.getItem(WATCH_LIST_STORAGE_KEY);
      return storedList ? JSON.parse(storedList) : initialState.watchList;
    } catch (e) {
      console.error("Local storage yüklenirken hata:", e);
      return initialState.watchList;
    }
  })();
  
  const [state, dispatch] = useReducer(appReducer, { 
    ...initialState, 
    watchList: initialWatchList 
  });

  // Kalıcılık (Persistence) için useEffect
  useEffect(() => {
    try {
      localStorage.setItem(WATCH_LIST_STORAGE_KEY, JSON.stringify(state.watchList));
    } catch (e) {
      console.error("Local storage kaydederken hata:", e);
    }
  }, [state.watchList]); 

  // API Çağrısı Fonksiyonu (Axios ile)
  const fetchShows = useCallback(async (query) => {
    if (!query) return;

    dispatch({ type: actionTypes.FETCH_INIT });
    
    try {
      const response = await axios.get(`${API_URL}${query}`);
      const shows = response.data.map(item => item.show);

      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: shows });
      
    } catch (error) {
      dispatch({ 
        type: actionTypes.FETCH_FAILURE, 
        payload: `Dizi yüklenirken bir sorun oluştu: ${error.message}` 
      });
    }
  }, []);

  // Uygulama Açılışında Varsayılan Arama
  useEffect(() => {
    fetchShows(initialState.searchTerm);
  }, [fetchShows]);

  // --- YÖNLENDİRME (ROUTING) MANTIĞI ---
  const renderPage = () => {
    const currentPath = window.location.pathname;
    
    // 1. Detay Sayfası Kontrolü (URL: /show/ID)
    if (currentPath.startsWith("/show/")) {
        return <ShowDetail />;
    }
    
    // 2. İzleme Listesi Kontrolü (URL: /izleme-listesi)
    if (currentPath.startsWith("/izleme-listesi")) {
        // WatchList sayfasına sadece state ve dispatch göndermek yeterli
        return <WatchList state={state} dispatch={dispatch} />; 
    }
    
    // 3. Ana Sayfa (URL: /)
    return <Home 
              state={state} 
              dispatch={dispatch} 
              fetchShows={fetchShows} 
           />;
  };

  return (
    <div className="App">
      <Header />
      
      <main className="main-content">
        {renderPage()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
