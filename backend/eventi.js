const mogoose = require('mongoose');
mogoose.connect('mongodb://localhost:27017/eventi')
.then(() => console.log('Connesso al database eventi'))
.catch(err => console.error('Errore di connessione al database eventi:', err));

//definizione dello schema degli eventi di studio collegandolo  con l'utente 1 a 1 con l'user
const eventoSchema = new mogoose.Schema({
    titolo: String,
    data: Date,
    descrizione: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Evento = mogoose.model('Evento', eventoSchema);

module.exports = Evento;