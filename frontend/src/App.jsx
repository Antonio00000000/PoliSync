import Navbar       from './components/Navbar';
import Login        from './components/Login';
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
    return (
        <div>

            {/* Componente Navbar (era il tag <nav> in index.html) */}
            <Navbar />

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

                {/* -------------------------------------------------- */}
                {/* Componenti Login e Registrazione                     */}
                {/* Dispensa pag. 13: composizione di componenti         */}
                {/* -------------------------------------------------- */}
                <Login />

                <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #ccc' }} />

                <Registrazione />

                {/* Sezioni statiche (da completare nelle prossime lezioni) */}
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
                    <div className="contenitore-prodotti" id="lista-dinamica-prodotti">
                        <div className="nuova-carta">
                            <i className="bi bi-file-plus-fill" id="bottone-aggiungi" style={{ cursor: 'pointer' }}></i>
                            <div className="nuovo">
                                <form id="form-aggiungi-prodotto">
                                    <input type="text" id="input-titolo" placeholder="Nome Prodotto" />
                                    <input type="number" id="input-prezzo" placeholder="Prezzo" min="0" />
                                    <input type="text" id="input-descrizione" placeholder="Descrizione Prodotto" />
                                    <input type="text" id="input-annoaccademico" placeholder="Anno Accademico (es. 2024/25)" />
                                    <input type="number" id="input-voto" placeholder="Voto Esame" min="18" max="30" />
                                </form>
                            </div>
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
