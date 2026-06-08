import { useState } from 'react';

// ============================================================
// COMPONENTE: Login
// ============================================================
// Dispensa pag. 32: "il valore dei suoi elementi venga
// mantenuto all'interno dello stato del componente"
//
// Dispensa pag. 36: "potremmo inserire un pulsante ed
// ascoltare l'evento submit sul form e agire,
// eventualmente con un handler asincrono"
//
// Dispensa pag. 30: rendering condizionale con ternario
// per mostrare pannello diverso in base allo stato
//
// MODIFICA: Passiamo { onLoginSuccess } come proprietà (prop)
// per poter aggiornare lo stato globale definito in App.jsx
// ============================================================
export default function Login({ onLoginSuccess }) {

    // -------------------------------------------------------
    // STATO DEL FORM
    // Dispensa pag. 32: "il valore dei suoi elementi venga
    // mantenuto all'interno dello stato del componente"
    // Dispensa pag. 28: raggruppiamo i campi correlati
    // in un unico oggetto
    // -------------------------------------------------------
    const [formDati, setFormDati] = useState({
        username: '',
        password: ''
    });

    // -------------------------------------------------------
    // STATO DELLO STATUS
    // Dispensa pag. 36: "Identifica i diversi stati visivi
    // del componente"
    // 'idle'       → form pronto per essere compilato
    // 'submitting' → richiesta in corso (bottone disabilitato)
    // 'success'    → login riuscito
    // 'error'      → credenziali errate o errore server
    // -------------------------------------------------------
    const [status, setStatus]   = useState('idle');
    const [errore, setErrore]   = useState('');
    const [accessToken, setAccessToken] = useState('');

    // -------------------------------------------------------
    // HANDLER: aggiorna lo stato ad ogni modifica del form
    // Dispensa pag. 32: onChange aggiorna lo stato
    // Dispensa pag. 28: spread operator per non perdere
    // gli altri campi dell'oggetto
    // -------------------------------------------------------
    function handleChange(e) {
        setFormDati({ ...formDati, [e.target.name]: e.target.value });
    }

    // -------------------------------------------------------
    // HANDLER: invia il form al backend
    // Dispensa pag. 36: "ascoltare l'evento submit sul form
    // e agire, eventualmente con un handler asincrono"
    // e.preventDefault() impedisce il cambio pagina
    // -------------------------------------------------------
    async function handleSubmit(e) {
        e.preventDefault();         // blocca il comportamento default del browser
        setStatus('submitting');    // disabilita il bottone durante la richiesta
        setErrore('');

        try {
            const risposta = await fetch('http://localhost:5000/api/utenti/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',     // necessario per ricevere il cookie del refresh token
                body: JSON.stringify(formDati)
            });

            const dati = await risposta.json();

            if (risposta.ok) {
                // 1. Salva l'access token nel localStorage per le chiamate API protette
                localStorage.setItem('token', dati.accessToken);
                
                // 2. Crea un oggetto con le informazioni dell'utente autenticato
                // Se il tuo backend restituisce informazioni dentro dati.utente, le uniamo qui
                const infoUtente = { nome: formDati.username, ...dati.utente };
                
                // 3. Salva l'oggetto utente nel localStorage convertito in stringa JSON
                localStorage.setItem('utente', JSON.stringify(infoUtente));

                setAccessToken(dati.accessToken);
                setStatus('success');

                // 4. Esegui la funzione passata da App.jsx per aggiornare lo stato globale.
                // Questo passaggio farà scomparire la sezione di login e registrazione.
                if (onLoginSuccess) {
                    onLoginSuccess(infoUtente);
                }
            } else {
                // Il server ha risposto con un errore (es. 401)
                setErrore(dati.message || 'Credenziali non valide');
                setStatus('error');
            }

        } catch (err) {
            // Errore di rete (es. server spento)
            setErrore('Impossibile contattare il server');
            setStatus('error');
        }
    }

    // -------------------------------------------------------
    // RENDERING CONDIZIONALE: login riuscito
    // Dispensa pag. 30: "isLoggedIn ? <AdminPanel /> : <LoginForm />"
    // -------------------------------------------------------
    if (status === 'success') {
        return (
            <div className="login">
                <p className="messaggio-successo">
                    ✅ Accesso effettuato con successo! Benvenuto, {formDati.username}.
                </p>
            </div>
        );
    }

    // -------------------------------------------------------
    // RENDERING: form di login
    // -------------------------------------------------------
    return (
        <div className="login">
            <h2>Accedi al Tuo Account</h2>

            {/* Mostriamo il messaggio di errore solo se presente */}
            {/* Dispensa pag. 36: "error !== null && <p>{error.message}</p>" */}
            {status === 'error' && (
                <p className="messaggio-errore">❌ {errore}</p>
            )}

            <form className="form-login" onSubmit={handleSubmit}>

                {/* Dispensa pag. 32: value collegato allo stato, onChange aggiorna */}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formDati.username}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formDati.password}
                    onChange={handleChange}
                    required
                />

                {/* Dispensa pag. 36: bottone disabilitato durante l'invio */}
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={status === 'submitting'}
                >
                    {status === 'submitting' ? 'Accesso in corso...' : 'Accedi'}
                </button>

            </form>
        </div>
    );
}