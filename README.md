# JSON Manager

Un'applicazione web standalone per visualizzare, modificare e gestire file JSON in modo intuitivo e user-friendly.

## Caratteristiche

- **Visualizzazione a Schede**: Interfaccia moderna con schede espandibili per navigare la struttura JSON
- **Caricamento Flessibile**: Carica file JSON o incolla direttamente il testo
- **Modifica Completa**: Aggiungi, modifica ed elimina elementi con form contestuali
- **Esportazione**: Scarica il JSON modificato o copiane il testo
- **Ricerca**: Cerca rapidamente nelle categorie e sottocategorie
- **Responsive**: Funziona perfettamente su desktop e dispositivi mobili
- **Statistiche**: Visualizza statistiche sulla struttura del JSON

## Come Utilizzare

### 1. Caricamento del JSON

**Opzione A: Carica File**
- Clicca su "Carica File" nella barra superiore
- Seleziona un file .json dal tuo computer

**Opzione B: Incolla Testo**
- Inserisci direttamente il contenuto JSON nella textarea
- Clicca su "Carica da Testo"

### 2. Navigazione

- **Schede Principali**: Ogni categoria principale appare come una scheda
- **Espansione**: Clicca su una scheda per vedere le sottocategorie
- **Breadcrumb**: Usa la barra di navigazione per tornare indietro
- **Ricerca**: Usa la barra di ricerca per filtrare le categorie

### 3. Modifica dei Dati

**Modificare un elemento esistente:**
- Clicca sul pulsante "Modifica" di una scheda
- Modifica il valore nel modal che appare
- Salva le modifiche

**Aggiungere un nuovo elemento:**
- Clicca sul pulsante "+" rosso in basso a destra
- Seleziona il tipo di dato da aggiungere
- Inserisci nome chiave e valore
- Salva l'elemento

**Eliminare un elemento:**
- Clicca sul pulsante "Elimina" di una scheda
- Conferma l'eliminazione

### 4. Esportazione

- Clicca su "Esporta" nella barra superiore
- Il file verrà scaricato automaticamente come `config.json`
- In alternativa, puoi copiare il testo JSON dalla console del browser

## Tipi di Dati Supportati

- **Stringhe**: Testo semplice
- **Numeri**: Valori numerici (interi e decimali)
- **Booleani**: true/false
- **Oggetti**: Strutture JSON annidate
- **Array**: Liste di elementi
- **Null**: Valori nulli

## Struttura del Progetto

```
json-manager/
├── index.html          # Interfaccia principale
├── style.css           # Stili CSS responsive
├── script.js           # Logica JavaScript
└── README.md           # Questa documentazione
```

## Requisiti Tecnici

- Browser moderno con supporto ES6+
- Nessuna dipendenza esterna (eccetto Font Awesome per le icone)
- Funziona offline come applicazione standalone

## Funzionalità Avanzate

- **Validazione JSON**: Controllo automatico della validità del JSON
- **Anteprime Intelligenti**: Visualizzazione smart del contenuto delle schede
- **Navigazione Breadcrumb**: Tracciamento del percorso di navigazione
- **Statistiche in Tempo Reale**: Conteggio chiavi, oggetti e array
- **Notifiche**: Feedback visivo per operazioni riuscite/fallite

## Esempi di Utilizzo

### Modifica Configurazioni
Perfetto per modificare file di configurazione complessi mantenendo la struttura JSON valida.

### Esplorazione Dati
Ideale per esplorare e comprendere strutture JSON di grandi dimensioni.

### Generazione JSON
Può essere utilizzato per creare nuovi file JSON da zero.

## Browser Supportati

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Sicurezza

L'applicazione funziona completamente nel browser senza inviare dati a server esterni. Tutto il processamento avviene localmente.

## Troubleshooting

**Il JSON non viene caricato:**
- Verifica che il JSON sia valido (usa un validatore online)
- Controlla che non ci siano caratteri speciali non escaped

**Le modifiche non vengono salvate:**
- Ricarica la pagina se hai problemi di stato
- Verifica che il browser supporti le funzionalità moderne

**Problemi di visualizzazione:**
- Assicurati che Font Awesome sia accessibile
- Prova con un browser aggiornato

## Contributi

Per segnalare bug o richiedere funzionalità, apri un issue nel repository.

## Licenza

Questa applicazione è distribuita sotto licenza MIT.
