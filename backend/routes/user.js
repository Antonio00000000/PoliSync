const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
mongoose.connect('mongodb://localhost:27017/utenti')
.then(() => console.log('Connesso al database utenti'))
.catch(err => console.error('Errore di connessione al database utenti:', err));

const utenteSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    dipartimento: String
});

//crea un nuovo utente
const nuovoUtente = async (username, password, dipartimento) => {
    //mi salvo la password criptata
    let psw = await bcrypt.hash(password, 10);
    const utente = new Utente({ username, psw, dipartimento });
    return await utente.create();
};

//funzione per controllare se le credenziali sono corrette al login
const controllo = async (username, password, dipartimento) => {
    try {
        const user = await Utente.findOne({ username });
        //confronto la password inserita con quella salvata nel database hashata
        if (bcrypt.compare(password, user.password)) {
            return true;
        } else {
            throw new Error('Credenziali non valide o devi prima registrarti');
        }
    }catch (err) {
        console.error('Errore durante il controllo delle credenziali:', err);
        throw err;  
    }
};



const Utente = mongoose.model('Utente', utenteSchema);

module.exports = router;