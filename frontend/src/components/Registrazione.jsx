import { useState } from 'react';

// ============================================================
// COMPONENTE: Registrazione
// ============================================================
// Stesso pattern del Login, con un campo in più (dipartimento)
// Dispensa pag. 33: gestiamo la select come gli altri input,
// usando value collegato allo stato e onChange
// ============================================================

export default function Registrazione() {

    // Raggruppiamo i tre campi del form in un unico oggetto
    // Dispensa pag. 28: "Raggruppa stati correlati"
    const [formDati, setFormDati] = useState({
        username:     '',
        password:     '',
        dipartimento: ''
    });

    // Status del componente (dispensa pag. 36)
    const [status, setStatus] = useState('idle');
    const [messaggio, setMessaggio] = useState('');

    // Aggiorna lo stato ad ogni modifica (dispensa pag. 32)
    function handleChange(e) {
        setFormDati({ ...formDati, [e.target.name]: e.target.value });
    }

    // Handler asincrono per l'invio del form (dispensa pag. 36)
    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('submitting');
        setMessaggio('');

        try {
            const risposta = await fetch('http://localhost:5000/api/utenti/registrati', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formDati)
            });

            const testo = await risposta.text();

            if (risposta.ok) {
                setStatus('success');
                setMessaggio(testo);
                // Resettiamo il form dopo la registrazione riuscita
                setFormDati({ username: '', password: '', dipartimento: '' });
            } else {
                setStatus('error');
                setMessaggio(testo);
            }

        } catch (err) {
            setStatus('error');
            setMessaggio('Impossibile contattare il server');
        }
    }

    return (
        <div className="login">
            <h2>Oppure Registrati ora</h2>

            {/* Messaggio di successo o errore (dispensa pag. 36) */}
            {status === 'success' && (
                <p className="messaggio-successo">✅ {messaggio}</p>
            )}
            {status === 'error' && (
                <p className="messaggio-errore">❌ {messaggio}</p>
            )}

            <form className="form-login" onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="username"
                    placeholder="Scegli Username"
                    value={formDati.username}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Scegli Password"
                    value={formDati.password}
                    onChange={handleChange}
                    required
                />

                {/* Dispensa pag. 33: la select usa value e onChange come gli altri */}
                <select
                    name="dipartimento"
                    value={formDati.dipartimento}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Seleziona Dipartimento</option>
                    <option value="Ingegneria Informatica">Ingegneria Informatica</option>
                    <option value="Ingegneria Elettronica">Ingegneria Elettronica</option>
                    <option value="Ingegneria Meccanica">Ingegneria Meccanica</option>
                    <option value="Ingegneria Civile">Ingegneria Civile</option>
                    <option value="Ingegneria Gestionale">Ingegneria Gestionale</option>
                </select>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={status === 'submitting'}
                >
                    {status === 'submitting' ? 'Registrazione in corso...' : 'Registrati'}
                </button>

            </form>
        </div>
    );
}
