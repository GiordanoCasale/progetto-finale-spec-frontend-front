import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Spinner, Alert } from "react-bootstrap";
import { useFavorites } from "../contexts/FavoriteContext";

const ComparatorPage = () => {
    const [phones, setPhones] = useState([]);
    const [phone1Id, setPhone1Id] = useState("");
    const [phone2Id, setPhone2Id] = useState("");
    const [phone1Details, setPhone1Details] = useState(null);
    const [phone2Details, setPhone2Details] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    useEffect(() => {
        const fetchPhones = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/telephones`);
                setPhones(res.data);
            } catch (err) {
                setError("Errore nel recupero dei telefoni.");
            }
        };
        fetchPhones();
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const [res1, res2] = await Promise.all([
                    phone1Id ? axios.get(`http://localhost:3001/telephones/${phone1Id}`) : Promise.resolve({ data: null }),
                    phone2Id ? axios.get(`http://localhost:3001/telephones/${phone2Id}`) : Promise.resolve({ data: null }),
                ]);
                setPhone1Details(res1.data?.telephone || null);
                setPhone2Details(res2.data?.telephone || null);
                setError(null);
            } catch (err) {
                setError("Errore nel recupero dei dettagli.");
            } finally {
                setLoading(false);
            }
        };

        if (phone1Id || phone2Id) fetchDetails();
    }, [phone1Id, phone2Id]);

    // Modifica qui: ora resettiamo l'altro dropdown se selezioniamo lo stesso telefono
    const handleSelect = (e, setFunc, otherId, setOtherFunc) => {
        const selectedId = e.target.value;

        if (selectedId === otherId) {
            setOtherFunc("");
        }

        setFunc(selectedId);
    };

    const renderDropdown = (id, value, setFunc, otherId, setOtherFunc) => (
        <Form.Select
            value={value}
            onChange={(e) => handleSelect(e, setFunc, otherId, setOtherFunc)}
        >
            <option value="">-- Seleziona telefono --</option>
            {phones.map(phone => (
                <option
                    key={phone.id}
                    value={phone.id}
                    disabled={phone.id === otherId} // disabilita telefono già selezionato nell'altro dropdown
                >
                    {phone.title}
                </option>
            ))}
        </Form.Select>
    );

    const renderSpecs = (phone) => {
        if (!phone) return <p>Seleziona un telefono</p>;

        const specs = Object.entries(phone).filter(([k]) =>
            !["id", "nome", "title", "imageUrl", "createdAt", "updatedAt"].includes(k)
        );

        return (
            <div>
                <h4>{phone.title}</h4>
                <button className="btn btn-outline-danger" onClick={() => toggleFavorite(phone.id)}>
                    {isFavorite(phone.id) ? "❤️" : "🤍"}
                </button>
                {phone.imageUrl && (
                    <img
                        src={phone.imageUrl}
                        alt={phone.title}
                        style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "contain",
                            marginBottom: "1rem"
                        }}
                    />
                )}
                <ul>
                    {specs.map(([key, value]) => (
                        <li key={key}><strong>{key}:</strong> {value}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <Container style={{ paddingTop: "2rem" }}>
            <h2>Comparatore di Telefoni</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {loading && <Spinner animation="border" />}

            <Row className="mb-4">
                <Col md={6}>
                    {renderDropdown("phone1", phone1Id, setPhone1Id, phone2Id, setPhone2Id)}
                </Col>
                <Col md={6}>
                    {renderDropdown("phone2", phone2Id, setPhone2Id, phone1Id, setPhone1Id)}
                </Col>
            </Row>

            <Row>
                <Col md={6} className="bg-light p-3 rounded">
                    {renderSpecs(phone1Details)}
                </Col>
                <Col md={6} className="bg-light p-3 rounded">
                    {renderSpecs(phone2Details)}
                </Col>
            </Row>
        </Container>
    );
};

export default ComparatorPage;
