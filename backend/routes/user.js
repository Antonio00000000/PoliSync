
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
const nuovoUtente = async (username, password, dipartimento) => {
    //mi salvo la password criptata
    let psw = await bcrypt.hash(password, 10);
    
    //mappature per creare un nuovo utente con i dati inseriti e salvarlo nel database
    const utente = new Utente({ username,password: psw, dipartimento });
    return await utente.save();
};

//funzione per controllare se le credenziali sono corrette al login
const controllo = async (username, password, dipartimento) => {
try {
        const user = await Utente.findOne({ username });
        
        // controllo se l'utente esiste effettivamente nel database
        if (!user) {
            throw new Error('Credenziali non valide o devi prima registrarti');
        }

        // mi compara la password inserita con quella salvata nel database
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            return true;
        } else {
            throw new Error('Credenziali non valide o devi prima registrarti');
        }
    } catch (err) {
        console.error('Errore durante il controllo delle credenziali:', err);
        throw err;  
    }
};

module.exports = router;