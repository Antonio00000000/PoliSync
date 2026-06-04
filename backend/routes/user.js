
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

mongoose.connect('mongodb://localhost:27017/utenti')
.then(() => console.log('Connesso al database utenti'))
.catch(err => console.error('Errore di connessione al database utenti:', err));

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
router.post('/register', async (req, res) => {

    //mi salvo la password criptata
    let psw = await bcrypt.hash(password, 10);
    
    try{
        const nuovoUtente = new Utente(req.body);
        await nuovoUtente.save();
        res.status(201).json(nuovoUtente);
    } catch (err) {
        res.status(500).json({ error: 'Errore durante la registrazione dell\'utente' });
    }
});

//funzione per controllare se le credenziali sono corrette al login
router.post('/login', async (req, res) => {
        const user = await Utente.findOne({ username });
        
        // controllo se l'utente esiste effettivamente nel database
        if (!user)
            throw new Error('Credenziali non valide o devi prima registrarti');
        // se esiste l'utente, mi compara la password inserita con quella salvata nel database
        else  const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch)
            return true;
        else
            throw new Error('password errata');
});

module.exports = router;