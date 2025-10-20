// Importa il context personalizzato per i preferiti
import { useFavorites } from '../contexts/FavoriteContext';

// Importa Link da React Router per navigare alle pagine di dettaglio
import { Link } from 'react-router-dom';

// Axios per le richieste HTTP
import axios from 'axios';

// Hook React per gestire stato ed effetti
import { useEffect, useState } from 'react';

// Componente per la pagina dei preferiti
const FavoritesPage = () => {
    // Estrae dallo useFavorites lo stato dei preferiti e la funzione per rimuoverli
    const { favorites, toggleFavorite } = useFavorites();

    // Stato per contenere la lista dei telefoni preferiti (con tutti i dati, non solo ID)
    const [phones, setPhones] = useState([]);

    // Effetto che recupera la lista dei telefoni preferiti quando cambia la lista dei preferiti
    useEffect(() => {
        const fetchPhones = async () => {
            try {
                // Ottiene tutti i telefoni dal backend
                const response = await axios.get("http://localhost:3001/telephones");

                // Filtra solo quelli i cui ID sono presenti nella lista dei preferiti
                const filtered = response.data.filter(phone => favorites.includes(phone.id));

                // Aggiorna lo stato
                setPhones(filtered);
            } catch (err) {
                console.error("Errore caricamento:", err); // Log in caso di errore
            }
        };

        fetchPhones(); // Chiama la funzione al caricamento o quando favorites cambia
    }, [favorites]); // Dipendenza: effetto si attiva ogni volta che la lista dei preferiti cambia

    // Se non ci sono telefoni preferiti, mostra un messaggio
    if (phones.length === 0) {
        return <div className="text-center mt-5">Nessun preferito trovato.</div>;
    }

    // Ritorno del JSX
    return (
        <div className="container mt-4">
            <h2>I tuoi Preferiti</h2>

            {/* Layout a griglia responsive con Bootstrap */}
            <div className='row row-cols-1 row-cols-md-3 g-4 mt-3'>

                {/* Cicla sui telefoni preferiti e crea una card per ognuno */}
                {phones.map(phone => (
                    <div className='col' key={phone.id}>
                        <div className='card h-100'>
                            <div className='card-body'>
                                {/* Titolo del telefono */}
                                <h5 className='card-title'>{phone.title}</h5>

                                {/* Categoria (es. smartphone, tablet, ecc.) */}
                                <p className='card-category'>{phone.category}</p>

                                {/* Pulsanti: Dettagli e Rimuovi */}
                                <div className='d-flex justify-content-between align-items-center'>

                                    {/* Pulsante per andare alla pagina di dettaglio del telefono */}
                                    <Link to={`/detail/${phone.id}`}>
                                        <button className='btn btn-primary'>Dettagli</button>
                                    </Link>

                                    {/* Pulsante per rimuovere il telefono dai preferiti */}
                                    <button
                                        className='btn btn-outline-danger'
                                        onClick={() => toggleFavorite(phone.id)}
                                    >
                                        Rimuovi ❤️
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

// Esportazione del componente per essere usato nell'app
export default FavoritesPage;
