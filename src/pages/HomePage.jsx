// Import librerie necessarie
import axios from 'axios'; // Per effettuare chiamate HTTP
import 'bootstrap/dist/css/bootstrap.min.css'; // Stili Bootstrap
import { useState, useEffect, useMemo } from 'react'; // Hook React
import { Link } from 'react-router-dom'; // Per navigazione interna
import { useFavorites } from '../contexts/FavoriteContext'; // Hook personalizzato per gestire i preferiti

// Componente principale della homepage
const HomePage = () => {
    // Stato che contiene tutti i telefoni recuperati
    const [telephones, setTelephones] = useState([]);

    // Stato che indica se i dati stanno ancora caricando
    const [loading, setLoading] = useState(true);

    // Stato per gestire il testo della ricerca
    const [input, setInput] = useState("");

    // Nuovo stato per input con debounce
    const [debouncedInput, setDebouncedInput] = useState("");

    // Stato per filtrare per categoria
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Stato per ordinamento (ascendente o discendente)
    const [sortOrder, setSortOrder] = useState('asc');

    // useEffect che viene eseguito una volta al montaggio del componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Effettua la chiamata GET per recuperare i telefoni
                const response = await axios.get(`http://localhost:3001/telephones/`);
                setTelephones(response.data); // Salva i telefoni nello stato
                setLoading(false); // Disattiva il loading
            } catch (error) {
                console.error('Errore fetching data:', error);
                setLoading(false); // Anche in caso di errore, disattiva il loading
            }
        };
        fetchData(); // Esegue la funzione asincrona
    }, []); // Effetto eseguito solo una volta

    // useEffect per applicare il debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedInput(input);
        }, 500);

        return () => clearTimeout(handler);
    }, [input]);

    // Estrae dal context dei preferiti le funzioni per usarli
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    // Crea dinamicamente l'elenco delle categorie disponibili
    const categories = ["all", ...new Set(telephones.map(phone => phone.category))];

    // Usa `debouncedInput` invece di `input` per il filtro
    const filteredTelephones = telephones.filter(telephone => {
        const matchesTitle = telephone.title.toLowerCase().includes(debouncedInput.toLowerCase());
        const matchesCategory = selectedCategory === "all" || telephone.category === selectedCategory;
        return matchesTitle && matchesCategory;
    });

    // Ordina i telefoni filtrati in base all'ordine selezionato (asc o desc)
    const sortedTelephones = useMemo(() => {
        return [...filteredTelephones].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.title.localeCompare(b.title); // Ordine A-Z
            } else {
                return b.title.localeCompare(a.title); // Ordine Z-A
            }
        });
    }, [filteredTelephones, sortOrder]); // Si aggiorna solo se cambia il filtro o l'ordinamento

    // Se i dati stanno caricando, mostra un messaggio
    if (loading) return <div className='text-center mt-5'>Loading...</div>;

    // Ritorno JSX del componente
    return (
        <div className="container mt-4">

            {/* Sezione superiore: ricerca, filtro per categoria e ordinamento */}
            <div className='row mb-3'>
                {/* Input per la ricerca per titolo */}
                <div className='col-md-6'>
                    <input
                        type="text"
                        className='form-control'
                        value={input}
                        onChange={(e) => setInput(e.target.value)} // Aggiorna lo stato della ricerca
                        placeholder='Cerca per titolo...'
                    />
                </div>

                {/* Selezione della categoria */}
                <div className='col-md-4'>
                    <select
                        className='form-select'
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)} // Aggiorna categoria selezionata
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === "all" ? "Tutte le categorie" : category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Bottone per invertire l’ordinamento alfabetico */}
                <div className='col-md-2'>
                    <button
                        className="btn btn-secondary w-100"
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} // Cambia l'ordine
                    >
                        Ordina {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            </div>

            {/* Gestione stato vuoto */}
            {sortedTelephones.length === 0 ? (
                <div className="text-center mt-5">
                    Nessun telefono trovato.
                </div>
            ) : (
                <div className='row row-cols-1 row-cols-md-3 g-4'>
                    {sortedTelephones.map((telephone) => (
                        <div className='col' key={telephone.id}>
                            <div className='card h-100'>
                                <div className='card-body'>
                                    {/* Titolo del telefono */}
                                    <h5 className='card-title'>{telephone.title}</h5>

                                    {/* Categoria del telefono */}
                                    <p className='card-category'>{telephone.category}</p>

                                    {/* Link alla pagina dei dettagli */}
                                    <Link to={`/detail/${telephone.id}`}>
                                        <button className='btn btn-primary'>Scopri di più</button>
                                    </Link>

                                    {/* Pulsante per aggiungere o rimuovere dai preferiti */}
                                    <button
                                        className='btn btn-outline-danger ms-2'
                                        onClick={() => toggleFavorite(telephone.id)}
                                    >
                                        {isFavorite(telephone.id) ? "❤️" : "🤍"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Esporta il componente per poterlo usare altrove
export default HomePage;
