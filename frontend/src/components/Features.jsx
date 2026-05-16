import React from 'react';
import { Link } from 'react-router-dom';
import './Features.css';

function Features() {
  // ARRAY DI OGGETTI: Questa è un'ottima pratica JS!
  // Invece di scrivere 3 volte lo stesso codice HTML, salviamo i dati 
  // in una lista e diciamo a React di "stamparli" in automatico.
  const serviziPoliSync = [
    {
      titolo: "Aule e Studio",
      descrizione: "Trova colleghi per studiare, prenota un posto nelle aule del Poliba e condividi appunti per superare gli esami.",
      icona: "bi-book", // Classe dell'icona Bootstrap
      link: "/studio"
    },
    {
      titolo: "Marketplace",
      descrizione: "Acquista, vendi o scambia libri usati, attrezzatura per il disegno, hardware e merchandising ufficiale Poliba.",
      icona: "bi-shop",
      link: "/prodotti"
    },
    {
      titolo: "Oggetti Smarriti",
      descrizione: "Hai perso qualcosa? Segnalalo qui o aiuta altri studenti a ritrovare i loro oggetti.",
      icona: "bi-search-heart",
      link: "/oggettiSmarriti"
    }
  ];

  return (
    <section className="features-section">
      <h2>Cosa puoi fare su PoliSync?</h2>
      
      <div className="features-grid">
        {/* Usiamo il metodo .map() per scorrere l'array. 
            Per ogni 'servizio' nell'array, React crea una 'feature-card' */}
        {serviziPoliSync.map((servizio, index) => (
          
          <Link to={servizio.link} className="feature-card" key={index}>
            <i className={`bi ${servizio.icona}`}></i>
            <h3>{servizio.titolo}</h3>
            <p>{servizio.descrizione}</p>
          </Link>
          
        ))}
      </div>
    </section>
  );
}

export default Features;