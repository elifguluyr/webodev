// src/state/appReducer.js

// Durumun (State) ilk hali
export const initialState = {
    // API Veri Yönetimi
    shows: [],              // API'den gelen mevcut dizi listesi
    loading: false,         // Yüklenme durumu
    error: null,            // Hata mesajı
    
    // Arama ve Filtreler
    searchTerm: 'friends',  // Ödev gereksinimi: Açılışta varsayılan sorgu
    filters: {
        genre: '',          // Türe göre filtre
        language: '',       // Dile göre filtre (Eklenecek)
        minRating: 0,       // Minimum puana göre filtre (Eklenecek)
    },
    
    // Favori Yönetimi (WatchList)
    watchList: [],          // İzleme listesindeki dizi ID'leri
    
    // Sayfalama (Pagination)
    currentPage: 1,
    pageSize: 6,            // Ödev gereksinimi: Her sayfada 6 dizi
};

// Eylem Tipleri (Actions)
export const actionTypes = {
    FETCH_INIT: 'FETCH_INIT',               // Veri çekme başladı
    FETCH_SUCCESS: 'FETCH_SUCCESS',         // Veri başarıyla çekildi
    FETCH_FAILURE: 'FETCH_FAILURE',         // Veri çekmede hata oluştu
    
    SET_SEARCH_TERM: 'SET_SEARCH_TERM',     // Arama terimini değiştir
    SET_FILTERS: 'SET_FILTERS',             // Filtreleri ayarla
    
    ADD_WATCHLIST: 'ADD_WATCHLIST',         // İzleme listesine ekle
    REMOVE_WATCHLIST: 'REMOVE_WATCHLIST',   // İzleme listesinden çıkar
    CLEAR_WATCHLIST: 'CLEAR_WATCHLIST',     // İzleme listesini temizle
    
    SET_PAGE: 'SET_PAGE',                   // Sayfa numarasını değiştir
};

// Reducer fonksiyonu: State'i Eyleme göre günceller
export function appReducer(state, action) {
    switch (action.type) {
        
        // --- API & YÜKLEME ---
        case actionTypes.FETCH_INIT:
            return {
                ...state,
                loading: true,
                error: null,
                shows: action.payload || state.shows, // Yeni aramada eski sonuçları temizle
            };
        case actionTypes.FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                shows: action.payload, // Gelen diziler
            };
        case actionTypes.FETCH_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload, // Hata mesajı
            };
            
        // --- ARAMA & FİLTRE ---
        case actionTypes.SET_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.payload,
                currentPage: 1, // Yeni aramada sayfayı sıfırla
            };
        case actionTypes.SET_FILTERS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    ...action.payload,
                },
                currentPage: 1, // Yeni filtrede sayfayı sıfırla
            };

        // --- FAVORİ YÖNETİMİ ---
        case actionTypes.ADD_WATCHLIST:
            if (!state.watchList.includes(action.payload)) {
                return {
                    ...state,
                    watchList: [...state.watchList, action.payload],
                };
            }
            return state;
            
        case actionTypes.REMOVE_WATCHLIST:
            return {
                ...state,
                watchList: state.watchList.filter(id => id !== action.payload),
            };

        case actionTypes.CLEAR_WATCHLIST:
            return {
                ...state,
                watchList: [],
            };
            
        // --- SAYFALAMA ---
        case actionTypes.SET_PAGE:
            return {
                ...state,
                currentPage: action.payload,
            };
            
        default:
            return state;
    }
}