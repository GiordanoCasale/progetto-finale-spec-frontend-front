import { useState, useEffect } from "react"
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useFavorites } from "../contexts/FavoriteContext"

const DetailPage = () => {
    const [telephone, setTelephone] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchTelephone = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/telephones/${id}`);
                setTelephone(response.data.telephone);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        fetchTelephone();
    }, [id]);

    const { favorites, toggleFavorite, isFavorite } = useFavorites();



    if (loading) return <div className="text-center mt-5">Caricamento...</div>;
    if (!telephone) return <div className="text-center mt-5">Nessun dato trovato per ID: {id}</div>;

    return (
        <div className="container mt-4">
            {telephone && (
                <div className="card">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img
                                src={telephone.imageUrl}
                                alt={telephone.title}
                                className="img-fluid rounded-start"
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    objectFit: 'contain',
                                    padding: '1rem'
                                }}
                            />
                        </div>
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
                                <button className="btn btn-outline-danger" onClick={() => toggleFavorite(telephone.id)}>
                                    {isFavorite(telephone.id) ? "❤️" : "🤍"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DetailPage
