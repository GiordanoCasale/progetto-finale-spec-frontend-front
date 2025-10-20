// Import degli hook di React
import { useState, useEffect } from "react";

// Libreria per richieste HTTP
import axios from 'axios';

// Hook di React Router per ottenere i parametri dall'URL
import { useParams } from 'react-router-dom';

// Hook personalizzato per accedere al contesto dei preferiti
import { useFavorites } from "../contexts/FavoriteContext";

// Componente per la pagina dei dettagli di un telefono
const DetailPage = () => {
    // Stato che conterrà i dati del telefono specifico
    const [telephone, setTelephone] = useState(null);

    // Stato per gestire il caricamento (true finché i dati non arrivano)
    const [loading, setLoading] = useState(true);

    // Estrae l'ID del telefono dalla URL (es: /telephones/5)
    const { id } = useParams();

    // Effetto che si attiva quando il componente monta o cambia l'ID
    useEffect(() => {
        const fetchTelephone = async () => {
            try {
                // Richiesta GET al server per ottenere i dati del telefono con l'ID fornito
                const response = await axios.get(`http://localhost:3001/telephones/${id}`);
                setTelephone(response.data.telephone); // Salva i dati del telefono nello stato
                setLoading(false); // Disattiva lo stato di caricamento
            } catch (error) {
                // In caso di errore, disattiva comunque il caricamento
                setLoading(false);
            }
        };

        fetchTelephone(); // Chiama la funzione asincrona per recuperare i dati
    }, [id]); // L'effetto si riesegue ogni volta che l'ID cambia

    // Recupera dallo useFavorites lo stato dei preferiti e le funzioni associate
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    // Se i dati sono ancora in fase di caricamento, mostra un messaggio di attesa
    if (loading) return <div className="text-center mt-5">Caricamento...</div>;

    // Se non esistono dati per l’ID fornito, mostra un messaggio di errore
    if (!telephone) return <div className="text-center mt-5">Nessun dato trovato per ID: {id}</div>;

    // Ritorno del JSX del componente
    return (
        <div className="container mt-4">
            {/* Verifica extra: se esistono dati del telefono, mostra la card */}
            {telephone && (
                <div className="card">
                    <div className="row g-0">

                        {/* Colonna dell’immagine del telefono */}
                        <div className="col-md-4">
                            <img
                                src={telephone.imageUrl} // URL immagine
                                alt={telephone.title} // Testo alternativo per l’accessibilità
                                className="img-fluid rounded-start"
                                style={{
                                    width: '100%',              // Larghezza piena della colonna
                                    height: '400px',            // Altezza fissa
                                    objectFit: 'contain',       // Adatta l’immagine senza tagliarla
                                    padding: '1rem'             // Spazio interno
                                }}
                            />
                        </div>

                        {/* Colonna dei dettagli */}
                        <div className="col-md-8">
                            <div className="card-body">
                                <h2 className="card-title">{telephone.title}</h2>
                                <p className="card-text">Categoria: {telephone.category}</p>
                                <p className="card-text">Marca: {telephone.brand}</p>
                                <p className="card-text">Prezzo: {telephone.price}</p>
                                <p className="card-text">Colore: {telephone.colour}</p>
                                <p className="card-text">Memoria: {telephone.memory}</p>
                                <p className="card-text">Anno: {telephone.year}</p>
                                <p className="card-text">Descrizione: {telephone.description}</p>

                                {/* Bottone per aggiungere/rimuovere dai preferiti */}
                                <button className="btn btn-outline-danger" onClick={() => toggleFavorite(telephone.id)}>
                                    {/* Mostra cuore pieno se è nei preferiti, altrimenti vuoto */}
                                    {isFavorite(telephone.id) ? "❤️" : "🤍"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Esportazione del componente per poterlo utilizzare altrove
export default DetailPage;
