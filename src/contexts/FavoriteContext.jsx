// Importazione degli hook di React
import { createContext, useContext, useState, useEffect } from "react";

// Creazione del contesto per i preferiti
const FavoriteContext = createContext();

// Componente provider che fornisce lo stato dei preferiti ai componenti figli
export const FavoriteProvider = ({ children }) => {

    // Stato dei preferiti, inizializzato con i dati presenti in localStorage (se presenti)
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("favorites"); // Recupera dati salvati
        return saved ? JSON.parse(saved) : [];           // Se ci sono, li parsea, altrimenti array vuoto
    });

    // Effetto che salva lo stato aggiornato dei preferiti in localStorage ogni volta che cambia
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites)); // Salva come stringa JSON
    }, [favorites]); // Dipendenza: si attiva ogni volta che 'favorites' cambia

    // Funzione per aggiungere o rimuovere un ID dai preferiti (toggle)
    const toggleFavorite = (id) => {
        setFavorites(prev =>
            prev.includes(id)         // Se l'ID è già tra i preferiti
                ? prev.filter(f => f !== id) // Lo rimuove
                : [...prev, id]             // Altrimenti, lo aggiunge
        );
    };

    // Funzione per verificare se un ID è tra i preferiti
    const isFavorite = (id) => favorites.includes(id);

    // Ritorna il context provider con il valore accessibile da tutta l'app
    return (
        <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children} {/* Renderizza tutti i componenti figli all’interno del provider */}
        </FavoriteContext.Provider>
    );
};

// Hook personalizzato per usare il contesto facilmente in qualsiasi componente
export const useFavorites = () => useContext(FavoriteContext);
