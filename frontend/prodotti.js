// URL dell'API del nostro server (Porta 5000, come definito nel server.js)
const API_URL = "http://localhost:5000/api/prodotti";

// COLLEGAMENTO CON IL DOM (HTML)
const contenitore = document.getElementById("lista-dinamica-prodotti");
const form = document.getElementById("form-aggiungi-prodotto");
const bottoneAggiungi = document.getElementById("bottone-aggiungi"); 

// =======================================================================
// 1. FUNZIONE PER CHIEDERE I PRODOTTI AL DATABASE (Operazione GET)
// =======================================================================
// Usiamo 'async' perché chiedere dati a un server richiede tempo e dobbiamo aspettare la risposta
async function caricaProdottiDalDatabase() {
    try {
        // fetch() bussa alla porta del server per chiedere i dati
        const risposta = await fetch(API_URL);
        
        // Trasformiamo la risposta del server in una lista di oggetti leggibile da JS
        const listaProdotti = await risposta.json();
        
        // Passiamo questa lista alla funzione che si occupa di disegnarli a schermo
        aggiornaSchermo(listaProdotti);
    } catch (errore) {
        console.error("Errore durante il caricamento dei prodotti dal server:", errore);
    }
}

// Avviamo questa funzione immediatamente all'apertura del sito, 
// così lo schermo caricherà i prodotti salvati in precedenza da chiunque!
caricaProdottiDalDatabase();


// =======================================================================
// 2. FUNZIONE PER STAMPARE I PRODOTTI A SCHERMO
// =======================================================================
// Riceve la lista dei prodotti dal database come parametro
function aggiornaSchermo(prodottiDaStampare) {
    
    // Pulizia delle vecchie carte prodotto (Il form a sinistra NON viene toccato)
    let vecchiProdotti = contenitore.querySelectorAll(".prodotto");
    for (let i = 0; i < vecchiProdotti.length; i++) {
        vecchiProdotti[i].remove();
    }

    // Ciclo per stampare la lista reale che arriva dal database
    for (let i = 0; i < prodottiDaStampare.length; i++) {
        let prodotto = prodottiDaStampare[i]; 

        let divProdotto = document.createElement("div");
        divProdotto.classList.add("prodotto");

        divProdotto.innerHTML = `
            <h3>${prodotto.titolo}</h3>
            <p><strong>Prezzo:</strong> ${prodotto.prezzo}£</p>
            <p>${prodotto.descrizione}</p>
            <p style="font-size: 0.85em; margin-top: 10px; color: #555;">
                <i class="bi bi-calendar3"></i> Anno: ${prodotto.anno} <br>
                <i class="bi bi-journal-check"></i> Voto esame: ${prodotto.voto}/30
            </p>
        `;

        contenitore.appendChild(divProdotto);
    }
}


// =======================================================================
// 3. GESTIONE DELL'INSERIMENTO (Operazione POST al click sul +)
// =======================================================================
// Rendiamo asincrona anche questa funzione perché dovrà comunicare con il server
bottoneAggiungi.addEventListener("click", async function() {
    
    const nuovoTitolo = document.getElementById("input-titolo").value;
    const nuovoPrezzo = document.getElementById("input-prezzo").value;
    const nuovaDescrizione = document.getElementById("input-descrizione").value;
    const nuovoAnno = document.getElementById("input-annoaccademico").value;
    const nuovoVoto = document.getElementById("input-voto").value;

    // --- FASE DI VALIDAZIONE (Controlli identici a prima) ---
    if (nuovoTitolo === "" || nuovoPrezzo === "" || nuovaDescrizione === "" || nuovoAnno === "" || nuovoVoto === "") {
        alert("Per favore, compila tutti i campi, inclusi Anno e Voto!");
        return; 
    }
    if (Number(nuovoPrezzo) < 0) {
        alert("Errore: Il prezzo non può essere negativo!");
        return; 
    }
    let votoNumerico = Number(nuovoVoto);
    if (votoNumerico < 18 || votoNumerico > 30) {
        alert("Errore: Il voto deve essere compreso tra 18 e 30!");
        return;
    }
    // --- FINE VALIDAZIONE ---

    // Pacchetto con i dati convalidati pronti per essere spediti
    const nuovoProdotto = {
        titolo: nuovoTitolo,
        prezzo: Number(nuovoPrezzo), // Convertiamo in numero reale
        descrizione: nuovaDescrizione,
        anno: nuovoAnno,
        voto: votoNumerico
    };

    try {
        // SPEDIZIONE AL SERVER (Richiesta POST)
        const risposta = await fetch(API_URL, {
            method: "POST", // Specifichiamo che vogliamo SCRIVERE dei dati
            headers: {
                "Content-Type": "application/json" // Avvisiamo il server che gli stiamo mandando del testo JSON
            },
            body: JSON.stringify(nuovoProdotto) // Trasformiamo il nostro oggetto JS in una stringa di testo
        });

        // Se il server risponde che tutto è andato a buon fine (status 200 o 201)
        if (risposta.ok) {
            // Chiediamo di nuovo al database la lista aggiornata (che ora conterrà il nuovo prodotto)
            caricaProdottiDalDatabase();
            // Svuotiamo i campi del form
            form.reset();
        } else {
            // Chiediamo al server di spiegarci quale è stato l'errore esatto
            const dettagliErrore = await risposta.json();
            alert("Errore MongoDB: " + dettagliErrore.errore);
            console.log("Dettagli completi:", dettagliErrore);
        }

    } catch (errore) {
        console.error("Errore durante l'invio del prodotto al server:", errore);
        alert("Impossibile connettersi al server.");
    }
});