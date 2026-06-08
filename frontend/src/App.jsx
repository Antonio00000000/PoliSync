import React, { useState, useEffect } from 'react';
import Navbar        from './components/Navbar';
import Login         from './components/Login';
import Registrazione from './components/Registrazione';

// ============================================================
// COMPONENTE: App
// ============================================================
// Dispensa pag. 13: "un componente faccia riferimento ad
// altri componenti nel suo output [...] React permette di
// separare le responsabilità dei diversi componenti"
//
// App è il componente radice che compone tutti gli altri.
// Ogni sezione della vecchia index.html diventa un componente
// separato o una sezione JSX.
// ============================================================

export default function App() {
    // useState definisce lo stato globale per tracciare l'utente autenticato (null se non loggato)
    const [utenteLoggato, setUtenteLoggato] = useState(null);

    // Stato per memorizzare gli elementi inseriti nel carrello
    const [carrello, setCarrello] = useState([]);

    // Stato per la lista dei prodotti visualizzati nel marketplace
    const [prodotti, setProdotti] = useState([]);

    // Stato per raccogliere i dati digitati nel form originale
    const [formProdotto, setFormProdotto] = useState({
        titolo: '',
        prezzo: '',
        descrizione: '',
        annoAccademico: ''
    });

    // useEffect controlla se l'utente era già loggato precedentemente al caricamento iniziale della pagina
    useEffect(() => {
        const utenteSalvato = localStorage.getItem('utente');
        if (utenteSalvato) {
            setUtenteLoggato(JSON.parse(utenteSalvato));
        }
    }, []);

    // Funzione di callback eseguita quando il componente Login segnala un accesso valido
    const handleLoginSuccess = (datiUtente) => {
        setUtenteLoggato(datiUtente);
    };

    // Funzioni per la gestione del carrello
    const aggiungiAlCarrello = (prodotto) => {
        setCarrello([...carrello, prodotto]);
    };

    const rimuoviDalCarrello = (indiceDaRimuovere) => {
        setCarrello(carrello.filter((_, index) => index !== indiceDaRimuovere));
    };

    // Aggiorna lo stato man mano che l'utente compila gli input
    const handleProdottoChange = (e) => {
        setFormProdotto({ ...formProdotto, [e.target.name]: e.target.value });
    };

    // Funzione associata al click del bottone "+"
    const handleAggiungiProdotto = () => {
        // Controllo base: evita di aggiungere prodotti senza nome o prezzo
        if (!formProdotto.titolo || !formProdotto.prezzo) {
            alert("Inserisci almeno il nome e il prezzo del prodotto.");
            return;
        }

        const nuovoProdotto = {
            nome: formProdotto.titolo, 
            prezzo: parseFloat(formProdotto.prezzo).toFixed(2),
            descrizione: formProdotto.descrizione,
            annoAccademico: formProdotto.annoAccademico
        };

        // Aggiunge il prodotto all'array per poterlo renderizzare
        setProdotti([...prodotti, nuovoProdotto]);

        // Svuota i campi del form ripristinando lo stato iniziale
        setFormProdotto({ titolo: '', prezzo: '', descrizione: '', annoAccademico: '' });
    };

    return (
        <div>

            <Navbar 
                utente={utenteLoggato} 
                setUtente={setUtenteLoggato} 
                carrello={carrello} 
                rimuoviDalCarrello={rimuoviDalCarrello}
            />

            <header>
                <div className="facciata">
                    <h1>Benvenuti in Poli<span>Sync</span></h1>
                    <p>
                        Il luogo ideale dove ogni studente del Politecnico può trovare tutto
                        ciò di cui ha bisogno. Organizza sessioni di studio condiviso, esplora
                        i prodotti marchiati Poliba e ritrova gli oggetti smarriti in modo
                        semplice e veloce.
                    </p>
                </div>
            </header>

            <section className="sezione-servizi">
                <h2>I Nostri Servizi</h2>
                <div className="contenitore-card">

                    <div className="card">
                        <i className="bi bi-people-fill icona-servizio"></i>
                        <h3>Aule Studio</h3>
                        <p>Organizza gruppi di studio, prenota posti e preparati al meglio per i prossimi esami al Poliba.</p>
                    </div>

                    <div className="card">
                        <i className="bi bi-shop icona-servizio"></i>
                        <h3>Marketplace</h3>
                        <p>Vendi e compra appunti, libri di testo ed elettronica in modo sicuro tra studenti.</p>
                    </div>

                    <div className="card">
                        <i className="bi bi-box-seam icona-servizio"></i>
                        <h3>Oggetti Smarriti</h3>
                        <p>Hai perso le chiavi o una pennetta USB in atrio? Segnalalo e ritrova i tuoi oggetti.</p>
                    </div>

                </div>

                {/* BLOCCO AUTENTICAZIONE */}
                {!utenteLoggato ? (
                    <div id="blocco-autenticazione" style={{ 
                        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch', 
                        gap: '20px', margin: '40px auto', maxWidth: '950px', backgroundColor: '#088599', 
                        padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                    }}>
                        <div id="login-section" style={{ flex: '1 1 350px', padding: '10px' }}>
                            <Login onLoginSuccess={handleLoginSuccess} />
                        </div>
                        <div className="divisore-verticale" style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.25)', margin: '0 15px', alignSelf: 'stretch' }}></div>
                        <div id="registrazione-section" style={{ flex: '1 1 350px', padding: '10px' }}>
                            <Registrazione />
                        </div>
                    </div>
                ) : (
                    <div className="info-message" style={{ textAlign: 'center', margin: '40px 0', fontSize: '1.3rem', color: '#28a745', fontFamily: "'Montserrat', sans-serif" }}>
                        <i className="bi bi-check-circle-fill"></i> Sei correttamente autenticato nel sistema.
                    </div>
                )}

                <article id="eventi">
                    <h2>Eventi in Arrivo</h2>
                    <div className="contenitore-eventi">
                        <div className="nuova-carta">
                            <i className="bi bi-calendar-plus-fill" id="bottone-aggiungi" style={{ cursor: 'pointer' }}></i>
                            <div className="nuovo">
                                <form>
                                    <input type="text" id="Titolo" placeholder="Titolo Evento" />
                                    <input type="date" id="Data" placeholder="Data Evento" />
                                    <input type="text" id="Descrizione" placeholder="Descrizione Evento" />
                                </form>
                            </div>
                        </div>
                    </div>
                </article>

                <article id="studio">
                    <h2>Aule Studio Disponibili</h2>
                    <div className="contenitore-aula">
                        <div className="aula">
                            <h3>Aula Magna</h3>
                            <p>Capienza: 100 posti</p>
                            <p>Dotata di proiettore e Wi-Fi</p>
                        </div>
                    </div>
                </article>

                <article id="prodotti">
                    <h2>Prodotti in Evidenza</h2>

                    {/* Contenitore principale flessibile per dividere form (sinistra) e lista (destra) */}
                    <div className="contenitore-prodotti" id="lista-dinamica-prodotti" style={{ display: 'flex', alignItems: 'flex-start', gap: '30px', marginTop: '20px' }}>
                        
                        {/* ----------------------------------------------------- */}
                        {/* COLONNA SINISTRA: STRUTTURA ORIGINALE DEL FORM        */}
                        {/* ----------------------------------------------------- */}
                        <div style={{ flexShrink: 0 }}>
                            <div className="nuova-carta">
                                {/* Al click sull'icona "+" invochiamo la funzione handleAggiungiProdotto */}
                                <i 
                                    className="bi bi-file-plus-fill" 
                                    id="bottone-aggiungi" 
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleAggiungiProdotto}
                                    title="Clicca per creare l'annuncio"
                                ></i>
                                <div className="nuovo">
                                    <form id="form-aggiungi-prodotto" onSubmit={(e) => e.preventDefault()}>
                                        {/* Collegamento dei campi value e onChange allo stato React */}
                                        <input 
                                            type="text" 
                                            name="titolo" 
                                            id="input-titolo" 
                                            placeholder="Nome Prodotto" 
                                            value={formProdotto.titolo} 
                                            onChange={handleProdottoChange} 
                                        />
                                        <input 
                                            type="number" 
                                            name="prezzo" 
                                            id="input-prezzo" 
                                            placeholder="Prezzo" 
                                            min="0" 
                                            value={formProdotto.prezzo} 
                                            onChange={handleProdottoChange} 
                                        />
                                        <input 
                                            type="text" 
                                            name="descrizione" 
                                            id="input-descrizione" 
                                            placeholder="Descrizione Prodotto" 
                                            value={formProdotto.descrizione} 
                                            onChange={handleProdottoChange} 
                                        />
                                        <input 
                                            type="text" 
                                            name="annoAccademico" 
                                            id="input-annoaccademico" 
                                            placeholder="Anno Accademico (es. 2024/25)" 
                                            value={formProdotto.annoAccademico} 
                                            onChange={handleProdottoChange} 
                                        />
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* ----------------------------------------------------- */}
                        {/* COLONNA DESTRA: PRODOTTI AGGIUNTI                     */}
                        {/* ----------------------------------------------------- */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', flexGrow: 1 }}>
                            {prodotti.map((prodotto, index) => (
                                <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', minWidth: '220px', flex: '1 1 220px', maxWidth: '300px' }}>
                                    <div>
                                        <h3 style={{ color: '#088599', marginTop: '0' }}>{prodotto.nome}</h3>
                                        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '10px 0' }}>{prodotto.prezzo}€</p>
                                        <p>{prodotto.descrizione}</p>
                                        <p style={{ fontSize: '0.8rem', color: '#666' }}>A.A.: {prodotto.annoAccademico}</p>
                                    </div>
                                    <button 
                                        onClick={() => aggiungiAlCarrello(prodotto)} 
                                        className="btn-primary" 
                                        style={{ marginTop: '15px', width: '100%', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
                                    >
                                        Aggiungi al Carrello
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>
                </article>

                <article id="oggettiSmarriti">
                    <h2>Oggetti Smarriti</h2>
                    <div className="contenitore-oggetti">
                        <div className="nuova-carta">
                            <i className="bi bi-plus-circle-fill"></i>
                            <div className="nuovo">
                                <form>
                                    <input type="text" placeholder="Nome Oggetto" />
                                    <input type="text" placeholder="Descrizione Oggetto" />
                                </form>
                            </div>
                        </div>
                    </div>
                </article>

            </section>

            <footer className="pie-di-pagina">
                <p>&copy; 2026 PoliSync - Il portale degli studenti. Tutti i diritti riservati.</p>
            </footer>

        </div>
    );
}