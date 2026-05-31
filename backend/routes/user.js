const mongoose = require('mongoose');
const router = require('express').Router();
mongoose.connect('mongodb://localhost:27017/utenti')
.then(() => console.log('Connesso al database utenti'))
.catch(err => console.error('Errore di connessione al database utenti:', err));

//definizione dello schema dell'user collegandolo 1 a molti con i figli eventi di studio
const utenteSchema = new mongoose.Schema({
    username: String,
    password: String,
    dipartimento: String
});

const Utente = mongoose.model('Utente', utenteSchema);

module.exports = router;

const controllo = (username, password, dipartimento) => {
    try {
        const user = await Utente.find({ username, password, dipartimento });
        if (user) {
            return true;
        } else {
            throw new Error('Credenziali non valide o devi prima registrarti');
        }
    }catch (err) {
        console.error('Errore durante il controllo delle credenziali:', err);
        throw err;  
    }
};
