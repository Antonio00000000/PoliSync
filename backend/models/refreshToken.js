const mongoose = require('mongoose');

// ============================================================
// MODELLO: RefreshToken
// ============================================================
// La dispensa (pag. 62) dice che abbiamo bisogno di:
// "Un modello per conservare i refresh token validi
//  con un riferimento all'utente"
// Ogni volta che un utente fa login, salviamo qui il suo
// refresh token. Se vogliamo "revocare" l'accesso, basta
// cancellare il documento corrispondente da questa collection.
// ============================================================

const refreshTokenSchema = new mongoose.Schema({

    // Il valore del refresh token (stringa opaca generata casualmente)
    value: {
        type: String,
        required: true,
        unique: true
    },

    // Riferimento all'utente proprietario del token
    // Corrisponde al campo "_id" del documento in collection "utenti"
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utente',
        required: true
    },

    // Data di creazione: utile per far scadere i refresh token
    // dopo un certo periodo (es. 7 giorni) se necessario
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
