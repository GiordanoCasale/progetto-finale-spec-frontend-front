
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/Progetto senza titolo (1).png'

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
            <div className="container position-relative">
                <Link className="navbar-brand" to="/">
                    <img
                        src={logo}
                        alt="immagine logo"
                        style={{
                            width: '150px',
                            objectFit: 'contain',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                </Link>


                <h1
                    className="position-absolute top-50 start-50 translate-middle text-light m-0"
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        letterSpacing: '1px'
                    }}
                >
                    Il miglior usato per le tue esigenze!
                </h1>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav gap-3">
                        <li className="nav-item">
                            <Link
                                className="nav-link fw-bold"
                                to="/"
                                style={{
                                    transition: 'color 0.3s ease',
                                    fontSize: '1.1rem'
                                }}
                                onMouseOver={(e) => e.target.style.color = '#0d6efd'}
                                onMouseOut={(e) => e.target.style.color = ''}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link fw-bold"
                                to="/Comparator"
                                style={{
                                    transition: 'color 0.3s ease',
                                    fontSize: '1.1rem'
                                }}
                                onMouseOver={(e) => e.target.style.color = '#0d6efd'}
                                onMouseOut={(e) => e.target.style.color = ''}
                            >
                                Comparatore
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link fw-bold"
                                to="/favorites"
                                style={{
                                    transition: 'color 0.3s ease',
                                    fontSize: '1.1rem'
                                }}
                                onMouseOver={(e) => e.target.style.color = '#0d6efd'}
                                onMouseOut={(e) => e.target.style.color = ''}
                            >
                                Preferiti
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar