const express = require('express');
// Creiamo il Router (il nostro mini-server specializzato per i prodotti)
const router = express.Router();
const mongoose = require('mongoose');

// =======================================================================
// STRUTTURA DEL DATABASE (Mongoose Schema & Model)
// =======================================================================
const prodottoSchema = new mongoose.Schema({
  titolo: String,
  prezzo: Number,
  descrizione: String,
  anno: String,
  voto: Number
});

// Il modello si occuperà di fare le operazioni sulla collezione "prodotti"
const Prodotto = mongoose.model('Prodotto', prodottoSchema);


// =======================================================================
// LE ROTTE API (Endpoints)
// =======================================================================

// NOTA BENE: Qui scriviamo solo "/" e non "/api/prodotti". 
// Sarà il server.js principale a dire che questo file gestisce il percorso "/api/prodotti".

// 1. ROTTA IN LETTURA (GET) - Endpoint: http://localhost:5000/api/prodotti
router.get('/', async (req, res) => {
  try {
    const prodotti = await Prodotto.find(); // Cerca tutti i prodotti nel DB
    res.json(prodotti); // Risponde inviando la lista in formato JSON
  } catch (err) {
    res.status(500).json({ errore: err.message });
  }
});

// 2. ROTTA IN SCRITTURA (POST) - Endpoint: http://localhost:5000/api/prodotti
router.post('/', async (req, res) => {
  try {
    const nuovoProdotto = new Prodotto(req.body); // Crea il prodotto con i dati arrivati dal form
    await nuovoProdotto.save(); // Lo salva fisicamente nel database
    res.status(201).json(nuovoProdotto); // Risponde dicendo "Creato con successo!"
  } catch (err) {
    res.status(400).json({ errore: err.message });
  }
});

// Esportiamo il router così il file server.js potrà importarlo e usarlo
module.exports = router;