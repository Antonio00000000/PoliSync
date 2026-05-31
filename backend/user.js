const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/utenti')
.then(() => console.log('Connesso al database utenti'))
.catch(err => console.error('Errore di connessione al database utenti:', err));

//definizione dello schema dell'user collegandolo 1 a molti con i figli eventi di studio
const utenteSchema = new mongoose.Schema({
    username: String,
    password: String,
    matricola: String,
});

const Utente = mongoose.model('Utente', utenteSchema);

module.exports = Utente;
