const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');   // necessario per leggere i cookie (refresh token)
require('dotenv').config();

// ============================================================
// IMPORTAZIONE PASSPORT E SESSION
// ============================================================

const expressSession = require('express-session');
const passport = require('passport');

const app = express();

// ============================================================
// MIDDLEWARE DI BASE
// ============================================================

app.use(cors({
    origin: 'http://localhost:5173',   // indirizzo del frontend React
    credentials: true                  // necessario per inviare i cookie con fetch
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Permette di leggere i cookie dalla richiesta (es. il refreshToken)
app.use(cookieParser());

// ============================================================
// CONFIGURAZIONE SESSIONE
// ============================================================

app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'polisync_secret',
    resave: false,              // non riscrive la sessione se non cambia
    saveUninitialized: false,   // non crea sessioni vuote
    cookie: {
        httpOnly: true,         // cookie non accessibile da JavaScript
        maxAge: 24 * 60 * 60 * 1000   // sessione valida 24 ore
    }
}));

// ============================================================
// INIZIALIZZAZIONE PASSPORT
// ============================================================


app.use(passport.initialize());
app.use(passport.session());


// ============================================================
// IMPORTAZIONE DEI ROUTER
// ============================================================

const prodottiRouter = require('./routes/prodotti');
const eventiRouter = require('./routes/eventi');

// Il router degli utenti esporta sia il router che il middleware verifyJWT
const utentiRouter = require('./routes/utenti');

// ============================================================
// CONNESSIONE A MONGODB
// ============================================================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connesso con successo!'))
    .catch(err => console.log('Errore di connessione a MongoDB:', err));


// ============================================================
// ROTTA DI TEST
// ============================================================

app.get('/', (req, res) => res.send('API PoliSync Attiva'));


// ============================================================
// COLLEGAMENTO DEI ROUTER
// ============================================================


// Rotte non protette (accessibili senza token)
app.use('/api/utenti', utentiRouter);

// Da qui in poi tutte le rotte richiedono un access token valido
app.use(utentiRouter.verifyJWT);

// Rotte PROTETTE (richiedono access token nell'header Authorization)
app.use('/api/prodotti', prodottiRouter);
app.use('/api/eventi', eventiRouter);


// ============================================================
// AVVIO DEL SERVER
// ============================================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server sulla porta ${PORT}`));
