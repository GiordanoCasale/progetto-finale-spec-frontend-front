// Import dei moduli React e librerie
import React, { useEffect, useState } from "react"; // Hook React per stato ed effetti
import axios from "axios"; // Per effettuare richieste HTTP
import { Container, Row, Col, Form, Spinner, Alert } from "react-bootstrap"; // Componenti UI Bootstrap
import { useFavorites } from "../contexts/FavoriteContext"; // Hook personalizzato per i preferiti

// Componente principale della pagina del comparatore, ora con confronto di 4 telefoni
const ComparatorPage = () => {

    // Stato per la lista completa dei telefoni disponibili
    const [phones, setPhones] = useState([]);

    // Stato per memorizzare gli ID dei telefoni selezionati, array di 4 elementi (inizialmente vuoti)
    const [selectedPhonesIds, setSelectedPhonesIds] = useState(["", "", "", ""]);

    // Stato per memorizzare i dettagli dei telefoni selezionati, array parallelo a selectedPhonesIds
    const [selectedPhonesDetails, setSelectedPhonesDetails] = useState([null, null, null, null]);

    // Stato per indicare se il caricamento è in corso
    const [loading, setLoading] = useState(false);

    // Stato per gestire eventuali errori di rete o fetch
    const [error, setError] = useState(null);

    // Importa dal context le funzioni per gestire i preferiti
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    // useEffect che carica la lista completa dei telefoni al montaggio del componente
    useEffect(() => {
        const fetchPhones = async () => {
            try {
                // Richiesta GET all'API per recuperare i telefoni
                const res = await axios.get(`http://localhost:3001/telephones`);
                setPhones(res.data); // Salva la lista nello stato
            } catch (err) {
                setError("Errore nel recupero dei telefoni."); // Mostra messaggio errore
            }
        };
        fetchPhones(); // Esegui la funzione asincrona
    }, []); // Solo una volta all'avvio

    // useEffect che si attiva quando cambia uno qualsiasi degli ID selezionati
    useEffect(() => {
        // Funzione per fare fetch parallelo dei dettagli dei telefoni selezionati
        const fetchDetails = async () => {
            setLoading(true); // Attiva il loading spinner
            try {
                // Mappa ogni ID in una chiamata API se ID non vuoto, altrimenti risolve con null
                const requests = selectedPhonesIds.map(id =>
                    id ? axios.get(`http://localhost:3001/telephones/${id}`) : Promise.resolve({ data: null })
                );
                // Esegui tutte le chiamate in parallelo con Promise.all
                const responses = await Promise.all(requests);
                // Estrai i dettagli da ogni risposta, o null se assente
                const details = responses.map(res => res?.data?.telephone || null);
                setSelectedPhonesDetails(details); // Aggiorna lo stato con i dettagli
                setError(null); // Resetta eventuali errori
            } catch (err) {
                setError("Errore nel recupero dei dettagli."); // Gestione errori
            } finally {
                setLoading(false); // Disattiva loading spinner
            }
        };

        // Esegui il fetch solo se almeno un telefono è selezionato
        if (selectedPhonesIds.some(id => id)) {
            fetchDetails();
        }
    }, [selectedPhonesIds]); // Si aggiorna quando cambia la selezione

    // Funzione per gestire la selezione di un telefono in un dropdown specifico
    // index = posizione del dropdown (0-3), selectedId = id selezionato
    const handleSelect = (index, selectedId) => {
        // Verifica che il telefono selezionato non sia già selezionato in un altro dropdown
        const otherIds = selectedPhonesIds.filter((_, i) => i !== index);
        if (otherIds.includes(selectedId)) return; // Se duplicato, ignora selezione

        // Crea nuova copia dello stato e aggiorna l'elemento selezionato
        const newIds = [...selectedPhonesIds];
        newIds[index] = selectedId;
        setSelectedPhonesIds(newIds); // Aggiorna lo stato con i nuovi ID
    };

    // Funzione per renderizzare un singolo dropdown di selezione telefoni
    const renderDropdown = (index) => (
        <Form.Select
            value={selectedPhonesIds[index]} // Valore selezionato
            onChange={(e) => handleSelect(index, e.target.value)} // On change aggiorna stato
        >
            <option value="">-- Seleziona telefono --</option>
            {/* Mappa ogni telefono per creare un'opzione, disabilita se già selezionato in altro dropdown */}
            {phones.map(phone => (
                <option
                    key={phone.id}
                    value={phone.id}
                    disabled={selectedPhonesIds.includes(phone.id) && selectedPhonesIds[index] !== phone.id}
                >
                    {phone.title}
                </option>
            ))}
        </Form.Select>
    );

    // Funzione per renderizzare la scheda con le specifiche di un singolo telefono
    const renderSpecs = (phone) => {
        // Se telefono non selezionato mostra messaggio placeholder
        if (!phone) return <p>Seleziona un telefono</p>;

        // Filtra solo le proprietà rilevanti da mostrare, escludendo metadati o chiavi inutili
        const specs = Object.entries(phone).filter(([k]) =>
            !["id", "nome", "title", "imageUrl", "createdAt", "updatedAt"].includes(k)
        );

        return (
            <div>
                {/* Titolo del telefono */}
                <h5>{phone.title}</h5>

                {/* Bottone per aggiungere/rimuovere dai preferiti */}
                <button className="btn btn-outline-danger mb-2" onClick={() => toggleFavorite(phone.id)}>
                    {isFavorite(phone.id) ? "❤️" : "🤍"} {/* Cuore pieno o vuoto */}
                </button>

                {/* Immagine del telefono */}
                {phone.imageUrl && (
                    <img
                        src={phone.imageUrl}
                        alt={phone.title}
                        style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "contain",
                            marginBottom: "1rem"
                        }}
                    />
                )}

                {/* Lista delle specifiche tecniche */}
                <ul className="list-unstyled">
                    {specs.map(([key, value]) => (
                        <li key={key}><strong>{key}:</strong> {value}</li>
                    ))}
                </ul>
            </div>
        );
    };

    // Controllo se nessun telefono è selezionato (tutti null o vuoti)
    const noPhonesSelected = selectedPhonesDetails.every(detail => detail === null);

    // JSX di ritorno del componente, organizzato in container, righe e colonne
    return (
        <Container style={{ paddingTop: "2rem" }}>
            <h2 className="mb-4">Comparatore di Telefoni</h2>

            {/* Mostra messaggio di errore se presente */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Mostra spinner di caricamento durante il fetch */}
            {loading && <Spinner animation="border" />}

            {/* Riga con i 4 dropdown di selezione telefoni */}
            <Row className="mb-4">
                {[0, 1, 2, 3].map(index => (
                    <Col md={3} key={index}>
                        {renderDropdown(index)} {/* Renderizza ogni dropdown */}
                    </Col>
                ))}
            </Row>

            {/* Se nessun telefono selezionato, mostra messaggio */}
            {noPhonesSelected ? (
                <div className="text-center mt-5">
                    <h5>Nessun telefono selezionato nel comparatore</h5>
                </div>
            ) : (
                /* Altrimenti mostra le schede di comparazione */
                <Row>
                    {[0, 1, 2, 3].map(index => (
                        <Col md={3} className="bg-light p-3 rounded mb-3" key={index}>
                            {renderSpecs(selectedPhonesDetails[index])} {/* Mostra specifiche */}
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

// Esportazione del componente per l’utilizzo nel progetto
export default ComparatorPage;
