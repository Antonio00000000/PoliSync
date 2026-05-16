import React from 'react';
// Importiamo 'Link' da react-router-dom. Serve a navigare tra le pagine 
// SENZA ricaricare il sito web, comportamento tipico delle Single Page Application.
import { Link } from 'react-router-dom';

function Navbar() {
  
  /* Questa è una funzione che gestisce l'Evento di submit del form.
     Quando premi "Invio" nella barra di ricerca, il browser per default ricarica 
     la pagina. e.preventDefault() BLOCCA questo comportamento standard.
  */
  const handleSearch = (e) => {
    e.preventDefault(); 
    console.log("Ricerca in corso...");
  };

  return (
    // In JSX usiamo className invece di class per assegnare gli stili CSS
    <nav className="navbar-container">
      
      {/* Il Link funge da tag <a>. 'to="/"' riporta sempre alla pagina principale */}
      <Link to="/" className="logo-section">
        <img src="/logo.png" alt="PoliSync Logo" />
        <div className="logo-text">
          Poli<span>Sync</span>
        </div>
      </Link>

      <div className="nav-links">
        <Link to="/eventi">Eventi</Link>
        <Link to="/studio">Studio</Link>
        <Link to="/oggettiSmarriti">Oggetti Smarriti</Link>
        <Link to="/prodotti">Prodotti</Link>
        
        <Link to="/carrello" className="cart-icon">
          <i className="bi bi-cart3"></i>
        </Link>

        {/* Colleghiamo la funzione handleSearch creata sopra all'evento onSubmit del form */}
        <form className="search-form" onSubmit={handleSearch}>
          <i className="bi bi-search"></i>
          {/* Tag input autoconclusivo (con la / finale), obbligatorio in React */}
          <input type="text" placeholder="Cerca..." />
        </form>
      </div>
    </nav>
  );
}

// Esportiamo il componente per poterlo importare in App.jsx
export default Navbar;