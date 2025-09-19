import { useFavorites } from '../contexts/FavoriteContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const FavoritesPage = () => {
    const { favorites, toggleFavorite } = useFavorites();
    const [phones, setPhones] = useState([]);

    useEffect(() => {
        const fetchPhones = async () => {
            try {
                const response = await axios.get("http://localhost:3001/telephones");
                const filtered = response.data.filter(phone => favorites.includes(phone.id));
                setPhones(filtered);
            } catch (err) {
                console.error("Errore caricamento:", err);
            }
        };
        fetchPhones();
    }, [favorites]);

    if (phones.length === 0) {
        return <div className="text-center mt-5">Nessun preferito trovato.</div>;
    }

    return (
        <div className="container mt-4">
            <h2>I tuoi Preferiti</h2>
            <div className='row row-cols-1 row-cols-md-3 g-4 mt-3'>
                {phones.map(phone => (
                    <div className='col' key={phone.id}>
                        <div className='card h-100'>
                            <div className='card-body'>
                                <h5 className='card-title'>{phone.title}</h5>
                                <p className='card-category'>{phone.category}</p>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Link to={`/detail/${phone.id}`}>
                                        <button className='btn btn-primary'>Dettagli</button>
                                    </Link>
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

export default FavoritesPage;