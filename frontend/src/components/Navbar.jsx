// ============================================================
// COMPONENTE: Navbar
// ============================================================
// Dispensa pag. 13: "React permette di separare le
// responsabilità dei diversi componenti"
// La navbar era in index.html, ora è un componente separato
// ============================================================

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo-container">
                <img src="immagini/logo_Background Removal.png" alt="Logo PoliSync" />
            </div>

            <div className="nav-links">
                {/* Dispensa pag. 6: in JSX usiamo className al posto di class */}
                <a href="#eventi">Eventi</a>
                <a href="#studio">Aule Studio</a>
                <a href="#prodotti">Prodotti</a>
                <a href="#oggettiSmarriti">Oggetti Smarriti</a>
                <a href="#carrello"><i className="bi bi-cart"></i></a>
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
