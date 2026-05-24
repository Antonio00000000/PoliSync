const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Importiamo il file del router dei prodotti che abbiamo appena creato
const prodottiRouter = require('./routes/prodotti');

// Connessione al Database MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connesso con successo!'))
  .catch(err => console.log('Errore di connessione a MongoDB:', err));

// Rotta di test iniziale
app.get('/', (req, res) => res.send('API PoliSync Attiva'));


// =======================================================================
// COLLEGAMENTO DEI ROUTER (I moduli esterni)
// =======================================================================
// Diciamo ad Express: "Tutte le richieste che iniziano con /api/prodotti 
// devono essere gestite dal file prodottiRouter".
app.use('/api/prodotti', prodottiRouter);

// Quando il tuo amico creerà le funzioni per gli eventi, farà semplicemente così:
// const eventiRouter = require('./routes/eventi');
// app.use('/api/eventi', eventiRouter);


// Avvio del server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server sulla porta ${PORT}`));