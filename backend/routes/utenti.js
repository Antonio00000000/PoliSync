const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');          // modulo nativo Node.js per stringhe casuali
const jwt = require('jsonwebtoken');    // "libreria jsonwebtoken"
const passport = require('passport');

// Importiamo il modello RefreshToken (dispensa pag. 62)
const RefreshToken = require('../models/refreshToken');

// ============================================================
// SCHEMA E MODELLO UTENTE
// ============================================================

const utenteSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dipartimento: {
        type: String,
        required: true
    }
});

const Utente = mongoose.model('Utente', utenteSchema);

// Esportiamo il modello Utente così può essere usato in server.js
// per configurare la strategia Passport
module.exports.Utente = Utente;


// ============================================================
// CONFIGURAZIONE PASSPORT – STRATEGIA LOCALE
// ============================================================

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            // Cerchiamo l'utente nel database per username
            const user = await Utente.findOne({ username });

            // Se l'utente non esiste, autenticazione fallita
            if (!user) {
                return done(null, false, { message: 'Utente non trovato' });
            }

            // Confrontiamo la password fornita con quella hashata nel DB
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Password errata' });
            }

            // Autenticazione riuscita: passiamo l'utente a done()
            return done(null, user);

        } catch (err) {
            return done(err);
        }
    }
));

// ============================================================
// SERIALIZZAZIONE / DESERIALIZZAZIONE UTENTE (per la sessione)
// ============================================================

passport.serializeUser(function (user, done) {
    // Salviamo solo id e username nella sessione (dati minimi)
    done(null, { id: user._id, username: user.username });
});

passport.deserializeUser(function (userSessionData, done) {
    // Ripristiniamo l'oggetto req.user dalla sessione ad ogni richiesta
    done(null, userSessionData);
});


// ============================================================
// HELPER: genera Access Token JWT
// ============================================================

function generaAccessToken(user) {
    return jwt.sign(
        {
            _id: user._id,
            username: user.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }   // scadenza breve, come insegna la dispensa
    );
}


// ============================================================
// ROTTA: POST /api/utenti/registrati
// ============================================================

router.post('/registrati', async (req, res) => {
    try {
        const { username, password, dipartimento } = req.body;

        if (!username || !password || !dipartimento) {
            return res.status(400).send("Tutti i campi sono obbligatori");
        }

        // Hassiamo la password prima di salvarla nel database
        const pswCriptata = await bcrypt.hash(password, 10);

        const nuovoUtente = new Utente({
            username,
            password: pswCriptata,
            dipartimento
        });

        await nuovoUtente.save();
        res.status(201).send("Registrazione completata con successo!");

    } catch (err) {
        console.error(err);
        res.status(500).send("Errore durante la registrazione dell'utente");
    }
});


// ============================================================
// ROTTA: POST /api/utenti/login  (con Passport)
// ============================================================

router.post('/login', (req, res, next) => {

    // passport.authenticate() verifica le credenziali usando la
    // strategia locale configurata sopra
    passport.authenticate('local', async (err, user, info) => {

        // Errore interno del server
        if (err) {
            console.error(err);
            return res.status(500).send("Errore interno durante il login");
        }

        // Credenziali errate (done(null, false) nella strategia)
        if (!user) {
            return res.status(401).send(info?.message || "Credenziali non valide");
        }

        // --- AUTENTICAZIONE RIUSCITA ---

        // 1) Stabiliamo la sessione
        req.logIn(user, async (err) => {
            if (err) return next(err);

            try {
                // 2) Generiamo l'Access Token JWT 
                const accessToken = generaAccessToken(user);

                // 3) Generiamo il Refresh Token come stringa opaca casuale
                //    Dispensa pag. 61: "GENERA UNA STRINGA OPACA (O UN JWT)"
                const refreshTokenValue = crypto.randomBytes(64).toString('hex');

                // 4) Salviamo il refresh token nel database (dispensa pag. 62)
                const nuovoRefreshToken = new RefreshToken({
                    value: refreshTokenValue,
                    user: user._id
                });
                await nuovoRefreshToken.save();

                // 5) Inviamo il refresh token come cookie HTTPOnly (dispensa pag. 61/59)
                //    HTTPOnly impedisce l'accesso via JavaScript (protezione XSS)
                res.cookie('refreshToken', refreshTokenValue, {
                    httpOnly: true,    // non accessibile da JS lato client
                    secure: false,     // mettere true in produzione con HTTPS
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 giorni in millisecondi
                });

                // 6) Inviamo l'access token nel corpo della risposta (dispensa pag. 61)
                return res.status(200).json({
                    message: "Login effettuato con successo!",
                    accessToken
                });

            } catch (err) {
                console.error(err);
                return res.status(500).send("Errore nella generazione dei token");
            }
        });

    })(req, res, next);
});


// ============================================================
// ROTTA: POST /api/utenti/refresh
// ============================================================

router.post('/refresh', async (req, res) => {
    try {
        // Leggiamo il refresh token dal cookie (dispensa pag. 62)
        const cookies = req.cookies;

        if (!cookies?.refreshToken) {
            return res.status(401).send("Refresh token non presente");
        }

        const refreshTokenValue = cookies.refreshToken;

        // Cerchiamo il refresh token nel database (dispensa pag. 62)
        const refreshObj = await RefreshToken.findOne({ value: refreshTokenValue });

        if (!refreshObj) {
            // Token non trovato: potrebbe essere stato revocato
            return res.status(403).send("Refresh token non valido o revocato");
        }

        // Recuperiamo l'utente associato al refresh token
        const user = await Utente.findById(refreshObj.user);

        if (!user) {
            return res.status(403).send("Utente associato non trovato");
        }

        // Generiamo un nuovo access token (dispensa pag. 62)
        const nuovoAccessToken = generaAccessToken(user);

        return res.status(200).json({
            message: "Access token rigenerato con successo",
            accessToken: nuovoAccessToken
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Errore durante il refresh del token");
    }
});


// ============================================================
// ROTTA: POST /api/utenti/logout
// ============================================================

router.post('/logout', async (req, res) => {
    try {
        // Leggiamo il refresh token dal cookie per revocarlo
        const cookies = req.cookies;

        if (cookies?.refreshToken) {
            // Eliminiamo il refresh token dal database (revoca)
            await RefreshToken.deleteOne({ value: cookies.refreshToken });
        }

        // Cancelliamo il cookie del refresh token dal browser
        res.clearCookie('refreshToken');

        // Disconnettiamo l'utente dalla sessione Passport (dispensa pag. 70)
        req.logout(function (err) {
            if (err) return res.status(500).send("Errore durante il logout");
            return res.status(200).send("Logout effettuato con successo");
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Errore interno durante il logout");
    }
});


// ============================================================
// MIDDLEWARE: verifyJWT
// ============================================================

function verifyJWT(req, res, next) {
    // Leggiamo l'header Authorization dalla richiesta
    const authHeader = req.headers['authorization'];

    // Il formato atteso è: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send("Token non fornito");
    }

    // Verifichiamo il token con il segreto (dispensa pag. 58)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            // Token scaduto o non valido → il client dovrà usare /refresh
            return res.status(403).send("Token non valido o scaduto");
        }

        // Rendiamo disponibili i dati dell'utente nel resto della richiesta
        req.userId = decoded._id;
        next();
    });
}

router.verifyJWT = verifyJWT;

module.exports = router;
