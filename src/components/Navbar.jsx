// Importazione del componente Link da react-router-dom per navigazione client-side tra le pagine
import { Link } from 'react-router-dom'

// Importazione del file CSS di Bootstrap per utilizzare le classi predefinite di stile
import 'bootstrap/dist/css/bootstrap.min.css';

// Importazione del logo da una cartella locale 
import logo from '../assets/Progetto senza titolo (1).png'

// Definizione del componente funzionale Navbar
const Navbar = () => {
    return (
        // Navbar Bootstrap con sfondo scuro, ombra e posizione fissa in alto
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">

            {/* Contenitore centrale della navbar con posizione relativa per posizionamenti assoluti interni */}
            <div className="container position-relative">

                {/* Logo cliccabile che riporta alla homepage ('/') */}
                <Link className="navbar-brand" to="/">
                    <img
                        src={logo} // Immagine del logo importata
                        alt="immagine logo" // Testo alternativo per l’accessibilità
                        style={{
                            width: '150px',             // Larghezza fissa del logo
                            objectFit: 'contain',       // L'immagine si adatta senza deformarsi
                            transition: 'transform 0.3s ease' // Animazione morbida su hover
                        }}
                        // All’hover il logo si ingrandisce leggermente (scala 1.05)
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        // Al termine dell’hover ritorna alla dimensione originale
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                </Link>

                {/* Titolo centrale assoluto, posizionato sopra la navbar, con testo promozionale */}
                <h1
                    className="position-absolute top-50 start-50 translate-middle text-light m-0"
                    style={{
                        fontSize: '1.5rem',      // Dimensione del font
                        fontWeight: 'bold',      // Grassetto
                        letterSpacing: '1px'     // Spaziatura tra lettere
                    }}
                >
                    Il miglior usato per le tue esigenze!
                </h1>

                {/* Bottone toggler visibile su schermi piccoli (responsive) per mostrare il menu */}
                <button
                    className="navbar-toggler" // Classe Bootstrap per bottone toggler
                    type="button"
                    data-bs-toggle="collapse"  // Indica il comportamento a collasso
                    data-bs-target="#navbarNav" // Collega il bottone al menu da mostrare
                    aria-controls="navbarNav"   // Accessibilità: indica quale elemento controlla
                    aria-expanded="false"       // Stato iniziale del menu
                    aria-label="Toggle navigation" // Etichetta per screen reader
                >
                    <span className="navbar-toggler-icon"></span> {/* Icona dell’hamburger menu */}
                </button>

                {/* Menu di navigazione, collassabile su dispositivi piccoli */}
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">

                    {/* Lista dei link di navigazione */}
                    <ul className="navbar-nav gap-3"> {/* gap-3 = spazio tra le voci del menu */}

                        {/* Voce: Home */}
                        <li className="nav-item">
                            <Link
                                className="nav-link fw-bold" // Stile del link: nav-link + grassetto
                                to="/"
                                style={{
                                    transition: 'color 0.3s ease', // Transizione del colore all'hover
                                    fontSize: '1.1rem' // Dimensione leggermente più grande
                                }}
                                // Cambia colore all’hover
                                onMouseOver={(e) => e.target.style.color = '#0d6efd'} // Blu Bootstrap
                                onMouseOut={(e) => e.target.style.color = ''}
                            >
                                Home
                            </Link>
                        </li>

                        {/* Voce: Comparatore */}
                        <li className="nav-item">
                            <Link
                                className="nav-link fw-bold"
                                to="/Comparator" // Link alla pagina Comparatore
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

                        {/* Voce: Preferiti */}
                        <li className="nav-item">
                            <Link
                                className="nav-link fw-bold"
                                to="/favorites" // Link alla pagina dei Preferiti
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

// Esportazione del componente Navbar per poterlo usare in altri file
export default Navbar
