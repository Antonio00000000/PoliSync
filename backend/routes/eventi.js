const mongoose = require('mongoose');
const router = require('express').Router();

//definizione dello schema degli eventi di studio collegandolo  con l'utente 1 a 1 con l'user
const eventoSchema = new mongoose.Schema({
    titolo: String,
    data: Date,
    descrizione: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Evento = mongoose.model('Evento', eventoSchema);

module.exports = router;