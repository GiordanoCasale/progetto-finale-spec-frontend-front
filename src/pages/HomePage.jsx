import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoriteContext';

const HomePage = () => {
    const [telephones, setTelephones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/telephones/`);
                setTelephones(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Errore fetching data:', error)
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    const categories = ["all", ...new Set(telephones.map(phone => phone.category))];

    const filteredTelephones = telephones.filter(telephone => {
        const matchesTitle = telephone.title.toLowerCase().includes(input.toLowerCase());
        const matchesCategory = selectedCategory === "all" || telephone.category === selectedCategory;
        return matchesTitle && matchesCategory;
    });

    const sortedTelephones = useMemo(() => {
        return [...filteredTelephones].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });
    }, [filteredTelephones, sortOrder]);

    if (loading) return <div className='text-center mt-5'>Loading...</div>

    return (
        <div className="container mt-4">
            <div className='row mb-3'>
                <div className='col-md-6'>
                    <input
                        type="text"
                        className='form-control'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='Cerca per titolo...'
                    />
                </div>
                <div className='col-md-4'>
                    <select
                        className='form-select'
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === "all" ? "Tutte le categorie" : category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='col-md-2'>
                    <button
                        className="btn btn-secondary w-100"
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    >
                        Ordina {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            </div>
            <div className='row row-cols-1 row-cols-md-3 g-4'>
                {sortedTelephones.map((telephone) => (
                    <div className='col' key={telephone.id}>
                        <div className='card h-100'>
                            <div className='card-body'>
                                <h5 className='card-title'>{telephone.title}</h5>
                                <p className='card-category'>{telephone.category}</p>
                                <Link to={`/detail/${telephone.id}`}>
                                    <button className='btn btn-primary'>Scopri di più</button>
                                </Link>
                                <button className='btn btn-outline-danher' onClick={() => toggleFavorite(telephone.id)}>
                                    {isFavorite(telephone.id) ? "❤️" : "🤍"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage
