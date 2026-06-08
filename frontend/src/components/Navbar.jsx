import React, { useState } from 'react';

// ============================================================
// COMPONENTE: Navbar
// ============================================================
// Dispensa pag. 13: "React permette di separare le
// responsabilità dei diversi componenti"
// La navbar era in index.html, ora è un componente separato
//
// Riceve l'array carrello e la funzione rimuoviDalCarrello
// ============================================================

export default function Navbar({ utente, setUtente, carrello, rimuoviDalCarrello }) {
    // Stato locale per mostrare/nascondere il pannello a tendina sotto il pulsante
    const [dropdownAperto, setDropdownAperto] = useState(false);
    
    // Gestione della rimozione delle credenziali per il Logout
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('utente');
        localStorage.removeItem('token');
        setUtente(null); // Aggiorna lo stato nel componente radice
    };

    return (
        <nav className="navbar">
            <div className="logo-container">
                <img src="immagini/logo_Background Removal.png" alt="Logo PoliSync" />
            </div>

            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                {/* Dispensa pag. 6: in JSX usiamo className al posto di class */}
                <a href="#">Home</a>
                <a href="#eventi">Eventi</a>
                <a href="#studio">Aule Studio</a>
                <a href="#prodotti">Prodotti</a>
                <a href="#oggettiSmarriti">Oggetti Smarriti</a>
                
                {/* Contenitore relativo necessario per posizionare la tendina esattamente sotto il link */}
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <a 
                        href="#carrello" 
                        onClick={(e) => {
                            e.preventDefault();
                            setDropdownAperto(!dropdownAperto);
                        }}
                    >
                        <i className="bi bi-cart"></i> ({carrello ? carrello.length : 0})
                    </a>

                    {/* PANNELLO CARRELLO A TENDINA (DROPDOWN) */}
                    {dropdownAperto && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            backgroundColor: '#ffffff',
                            color: '#112142',
                            border: '2px solid #088599',
                            borderRadius: '8px',
                            padding: '15px',
                            minWidth: '280px',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                            zIndex: 1000,
                            marginTop: '10px'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ddd', paddingBottom: '5px', color: '#112142' }}>
                                Il tuo Carrello
                            </h4>
                            
                            {carrello.length === 0 ? (
                                <p style={{ color: '#555', fontStyle: 'italic', margin: '5px 0', fontSize: '0.9rem' }}>
                                    Il tuo carrello è vuoto.
                                </p>
                            ) : (
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
                                    {carrello.map((item, index) => (
                                        <li key={index} style={{ padding: '6px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '85%' }}>
                                                <span>{item.nome}</span>
                                                <strong style={{ color: '#088599', marginLeft: '10px' }}>{item.prezzo}€</strong>
                                            </div>
                                            
                                            {/* Pulsante per rimuovere il singolo elemento dal carrello */}
                                            <button 
                                                onClick={() => rimuoviDalCarrello(index)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#ff4d4d',
                                                    cursor: 'pointer',
                                                    fontSize: '1rem',
                                                    padding: '0 5px',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                                title="Rimuovi elemento"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Se l'utente non è loggato, mostra i link di ancoraggio ai moduli in fondo alla pagina */}
                {!utente && (
                    <>
                        <a href="#login-section">Accedi</a>
                        <a href="#registrazione-section">Registrati</a>
                    </>
                )}

                {/* Se l'utente ha effettuato l'accesso, mostra il collegamento ipertestuale di Logout */}
                {utente && (
                    <a href="#" onClick={handleLogout} className="logout-btn" style={{ color: '#ff4d4d' }}>
                        Logout
                    </a>
                )}
            </div>

            <div className="nav-search">
                {/* Non usiamo action sul form: la ricerca sarà gestita via JS */}
                <form id="search-form">
                    <input type="text" id="search-input" placeholder="Cerca..." />
                    <i className="bi bi-search" id="menu-icon"></i>
                </form>
            </div>
        </nav>
    );
}