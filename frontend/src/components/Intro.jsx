import React from 'react';
import { Link } from 'react-router-dom'; // Gestisce la navigazione interna della SPA
import './Intro.css';
import Features from './Features'; // Importa la griglia dei servizi

function Intro() {
  return (
    // Il Fragment (<>) raggruppa gli elementi senza creare div inutili nel DOM
    <>
      <section className="hero-section">
        <h1>Benvenuti in Poli<span>Sync</span></h1>
        
        <p>
          Il luogo ideale dove ogni studente del Politecnico può trovare tutto ciò di cui ha bisogno. 
          Organizza sessioni di studio condiviso, esplora i prodotti marchiati Poliba e ritrova gli 
          oggetti smarriti in modo semplice e veloce.
        </p>
        
        <div className="hero-buttons">
          <Link to="/studio" className="btn-primary">
            Trova un'Aula
          </Link>
          <Link to="/prodotti" className="btn-secondary">
            Esplora Prodotti
          </Link>
        </div>
      </section>

      {/* Renderizza le schede subito sotto la sezione principale */}
      <Features />
    </>
  );
}

export default Intro;