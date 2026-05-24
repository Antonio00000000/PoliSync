// Partiamo con un array (una lista) completamente vuoto. 
// Qui dentro salveremo tutti gli oggetti "prodotto" creati dall'utente.
let listaProdotti = [];


// 2. COLLEGAMENTO TRA JAVASCRIPT E HTML (Il DOM)

// 'Peschiamo' gli elementi della pagina web usando i loro ID.
// In questo modo JavaScript può vederli e modificarli.
const contenitore = document.getElementById("lista-dinamica-prodotti"); // Il div gigante che contiene tutto
const form = document.getElementById("form-aggiungi-prodotto");         // Il modulo con i campi di testo
const bottoneAggiungi = document.getElementById("bottone-aggiungi");    // L'icona col "+" che fa da pulsante

// 3. LA FUNZIONE CHE DISEGNA L'INTERFACCIA GRAFICA
// Questa funzione ha il compito di leggere l'array e trasformarlo in HTML
function aggiornaSchermo() {
    
    // FASE A: PULIZIA
    // Se svuotassimo l'intero contenitore, cancelleremmo anche il form!
    // Quindi cerchiamo solo i div che hanno la classe ".prodotto" e li rimuoviamo.
    let vecchiProdotti = contenitore.querySelectorAll(".prodotto");
    for (let i = 0; i < vecchiProdotti.length; i++) {
        vecchiProdotti[i].remove(); // Rimuove fisicamente la vecchia carta dalla pagina
    }

    // FASE B: STAMPA DEI DATI AGGIORNATI
    // Scorriamo il nostro array con un ciclo 'for'. 
    // Per ogni prodotto che troviamo nell'array, creiamo una nuova carta.
    for (let i = 0; i < listaProdotti.length; i++) {
        let prodotto = listaProdotti[i]; // Estraiamo il singolo prodotto su cui stiamo lavorando

        // 1. Creiamo un nuovo elemento 'div' (un contenitore vuoto)
        let divProdotto = document.createElement("div");
        
        // 2. Gli assegniamo la classe CSS per fargli prendere lo stile grafico delle carte
        divProdotto.classList.add("prodotto");

        // 3. Inseriamo i dati del prodotto dentro l'HTML del div.
        // Usiamo i backtick ( ` ) per andare a capo comodamente e ${} per inserire le variabili.
        divProdotto.innerHTML = `
            <h3>${prodotto.titolo}</h3>
            <p><strong>Prezzo:</strong> ${prodotto.prezzo}€</p>
            <p>${prodotto.descrizione}</p>
            <p style="font-size: 0.85em; margin-top: 10px; color: #555;">
                <i class="bi bi-calendar3"></i> Anno: ${prodotto.anno} <br>
                <i class="bi bi-journal-check"></i> Voto esame: ${prodotto.voto}/30
            </p>
        `;

        // 4. "Appendiamo" (attacchiamo) questa carta appena completata dentro il contenitore principale.
        // Dato che usiamo Flexbox nel CSS, i nuovi prodotti si posizioneranno in automatico a destra del form.
        contenitore.appendChild(divProdotto);
    }
}

// 4. L'EVENT LISTENER (Cosa succede quando si clicca sul "+")
// Diciamo a JavaScript di rimanere in ascolto (listen) del 'click' sull'icona "+"
bottoneAggiungi.addEventListener("click", function() {
    
    // 1. LETTURA DEI DATI: Prendiamo i testi scritti dall'utente nelle varie caselle
    const nuovoTitolo = document.getElementById("input-titolo").value;
    const nuovoPrezzo = document.getElementById("input-prezzo").value;
    const nuovaDescrizione = document.getElementById("input-descrizione").value;
    const nuovoAnno = document.getElementById("input-annoaccademico").value;
    const nuovoVoto = document.getElementById("input-voto").value;

    // 2. VALIDAZIONE (Controlli di sicurezza prima di salvare i dati)
    
    // Controllo A: Nessun campo deve essere lasciato vuoto ("")
    if (nuovoTitolo === "" || nuovoPrezzo === "" || nuovaDescrizione === "" || nuovoAnno === "" || nuovoVoto === "") {
        alert("Per favore, compila tutti i campi!");
        return; // Il 'return' blocca istantaneamente l'esecuzione della funzione
    }

    // Controllo B: Il prezzo non può scendere sotto lo zero
    if (Number(nuovoPrezzo) < 0) {
        alert("Errore: Il prezzo non può essere negativo!");
        return; 
    }

    // Controllo C: Il voto deve avere senso nel contesto universitario (tra 18 e 30)
    let votoNumerico = Number(nuovoVoto);
    if (votoNumerico < 18 || votoNumerico > 30) {
        alert("Errore: Il voto deve essere compreso tra 18 e 30!");
        return;
    }

    // 3. SALVATAGGIO DEI DATI
    // Se i dati superano tutti i controlli senza far scattare i 'return', creiamo un "Oggetto" JavaScript
    const nuovoProdotto = {
        titolo: nuovoTitolo,
        prezzo: nuovoPrezzo,
        descrizione: nuovaDescrizione,
        anno: nuovoAnno,
        voto: votoNumerico
    };

    // Inseriamo il nuovo oggetto alla fine del nostro array principale
    listaProdotti.push(nuovoProdotto);

    // 4. AGGIORNAMENTO GRAFICA E RESET
    // Ora che l'array ha un elemento in più, chiamiamo la funzione per ridisegnare lo schermo
    aggiornaSchermo();

    // Infine, svuotiamo tutte le caselle del form per essere pronti al prossimo inserimento
    form.reset();
});