# Dany Framework

Dany Framework è una base frontend piccola e riutilizzabile per applicazioni self-hosted. Nasce dall'estrazione di componenti già usati e validati in applicazioni reali: non è un framework progettato in astratto.

## Filosofia

- Nessuna conoscenza del dominio dell'applicazione.
- API semplici, dipendenze esplicite e nessuna dipendenza esterna.
- Una responsabilità chiara per modulo.
- Pochi componenti verificati sono preferibili a un framework costruito in anticipo.

## Struttura

```text
frontend/
├── core/
│   └── selection-manager.js
├── data/
│   └── api-client.js
└── interaction/
    └── long-press.js
```

- `core/` contiene stato e comportamenti indipendenti dalla UI specifica.
- `data/` contiene accesso ai dati senza conoscere endpoint o dominio applicativo.
- `interaction/` contiene meccanismi di interazione browser riusabili.

Non sono presenti barrel export, build system, package manager o dipendenze esterne.

## SelectionManager

```js
import { SelectionManager } from "/dany-framework/frontend/core/selection-manager.js";
```

`SelectionManager` gestisce una modalità di selezione e un insieme di ID opachi. Può quindi selezionare messaggi, righe, marker o qualsiasi altro elemento identificabile, senza conoscerne il significato.

### API pubblica

- `enter()` attiva la modalità selezione.
- `exit()` disattiva la modalità selezione.
- `select(id)` aggiunge un ID.
- `deselect(id)` rimuove un ID.
- `toggle(id)` aggiunge o rimuove un ID e restituisce `true` se lo ha aggiunto, `false` se lo ha rimosso.
- `clear()` rimuove tutti gli ID.
- `has(id)` restituisce se un ID è selezionato.
- `getSelected()` restituisce un array con gli ID selezionati.
- `count` restituisce il numero di ID selezionati.
- `isActive` indica se la modalità selezione è attiva.

Mantiene internamente un `Set` di ID e il flag `isActive`. Non riceve né manipola elementi DOM, classi CSS, API o dati di dominio.

```js
const selection = new SelectionManager();

selection.enter();
selection.select("row-12");

if (selection.has("row-12")) {
  console.log(selection.count); // 1
}

selection.clear();
selection.exit();
```

L'applicazione resta responsabile del rendering della selezione e delle azioni sugli elementi selezionati.

## bindLongPress

```js
import { bindLongPress } from "/dany-framework/frontend/interaction/long-press.js";
```

`bindLongPress(element, options)` collega il riconoscimento del long press a un elemento DOM. Gestisce timer e annullamento del gesto, ma non decide cosa significhi un long press per l'applicazione.

### Opzioni supportate

- `delay`: durata in millisecondi; il valore predefinito è `500`.
- `shouldStart(event)`: se restituisce `false`, il timer non viene avviato.
- `onTouchStart(event)`: invocata all'inizio del touch.
- `onTouchMove(event)`: invocata al movimento; il timer viene annullato.
- `onLongPress(event)`: invocata allo scadere della durata configurata.

La funzione restituisce una funzione di cleanup che rimuove i listener e annulla un timer pendente.

```js
const stopLongPress = bindLongPress(button, {
  delay: 500,
  shouldStart: () => !isBusy,
  onLongPress: event => {
    event.preventDefault();
    openContextActions();
  }
});

// Quando l'elemento non serve più:
stopLongPress();
```

Il modulo richiede un elemento DOM con `addEventListener` e `removeEventListener`, ma non contiene logica specifica di DropMind, card, CSS o selezione.

## createApiClient

```js
import { createApiClient } from "/dany-framework/frontend/data/api-client.js";
```

`createApiClient({ baseUrl, token })` crea un piccolo client HTTP configurato una volta dall'applicazione.

```js
const api = createApiClient({
  baseUrl: "/api",
  token: appConfig.apiToken
});

const response = await api.fetch("/notes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "Promemoria" })
});

if (!response.ok) {
  throw new Error("Request failed");
}

const note = await response.json();
```

### Contratto

- `api.fetch(path, options)` costruisce l'URL con `baseUrl + path`.
- Se `token` è configurato, aggiunge `Authorization: Bearer <token>` preservando gli altri header e le normali opzioni di `fetch`.
- Se `token` è assente, non aggiunge l'header Authorization.
- Restituisce direttamente la `Response` nativa.

La convenzione attuale è usare una `baseUrl` senza slash finale, ad esempio `"/api"`, e un `path` con slash iniziale, ad esempio `"/notes"`.

Il client non fa parsing JSON, non gestisce errori HTTP, non implementa retry o cache e non conosce endpoint o dominio DropMind. `Response.json()` e la gestione degli errori restano responsabilità dell'application layer.

## Browser e ES modules

I moduli sono pensati per il browser e usano ES modules nativi. Devono essere serviti da un server HTTP(S) che esponga i file JavaScript; non sono pensati per essere aperti direttamente dal filesystem. `createApiClient` richiede che `fetch` sia disponibile nel browser.

## Utilizzo fuori da DropMind

Un'altra piccola applicazione può usare `SelectionManager` per selezionare righe o marker, `bindLongPress` per aprire azioni contestuali e `createApiClient` per comunicare con la propria API configurando base URL e token. L'applicazione mantiene sempre i propri dati, il proprio rendering, la propria autenticazione runtime e le proprie decisioni di UX.

## Regola di ammissione

Un componente entra nel framework solo se ha una responsabilità chiaramente riutilizzabile, un'API piccola, nessuna dipendenza dal dominio applicativo e almeno un caso d'uso reale oltre al punto in cui è nato. Se richiede astrazioni aggiuntive solo per entrare nel framework, resta nell'application layer finché non emerge un confine migliore.
