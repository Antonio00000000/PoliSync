
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//per criptare la password
const bcrypt = require('bcrypt');

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

//crea un nuovo utente
router.post('/registrati', async (req, res) => {
    try {
        const { username, password, dipartimento } = req.body;

        if (!username || !password || !dipartimento) {
            return res.status(400).send("Tutti i campi sono obbligatori");
        }

        // Criptiamo la password
        const pswCriptata = await bcrypt.hash(password, 10);

        // Creiamo il documento associando la password hashata
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

//funzione per controllare se le credenziali sono corrette al login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Utente.findOne({ username });

        // Controllo se l'utente esiste
        if (!user) {
            return res.status(401).send("Credenziali non valide o devi prima registrarti");
        }

        // Compara la password inserita con quella cifrata nel DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Inviamo una risposta HTTP valida al browser
            return res.status(200).send("Login effettuato con successo!");
        } else {
            return res.status(401).send("Password errata");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send("Errore interno durante il login");
    }
});

module.exports = router;