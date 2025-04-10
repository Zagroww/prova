// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configura middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Limite aumentato per supportare immagini grandi
app.use(express.static(path.join(__dirname, 'public')));

// Percorso della cartella in cui salvare le immagini
const capturesDir = path.join(__dirname, 'captures');

// Verifica se la cartella "captures" esiste; altrimenti, creala
if (!fs.existsSync(capturesDir)) {
    console.log('Cartella "captures" non trovata. La creo ora...');
    fs.mkdirSync(capturesDir, { recursive: true });
    console.log('Cartella "captures" creata con successo');
}

// Endpoint per ricevere l'immagine
app.post('/upload', (req, res) => {
    console.log("Ricevuta richiesta POST per /upload");

    const fotoBase64 = req.body.foto;
    if (!fotoBase64) {
        console.error("Errore: nessuna foto ricevuta!");
        return res.status(400).json({ message: 'Foto non trovata' });
    }

    // Per evitare di inondare i log, stampiamo solo i primi 100 caratteri
    console.log("Dati foto (primi 100 caratteri):", fotoBase64.substring(0, 100));

    // Estrai il formato e i dati Base64
    const matches = fotoBase64.match(/^data:image\/(png|jpg|jpeg);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        console.error("Formato della foto non valido");
        return res.status(400).json({ message: 'Formato foto non valido' });
    }

    const imageType = matches[1];
    const base64Data = matches[2];

    // Genera un timestamp e raccogli altre informazioni (IP, User-Agent)
    const timestamp = new Date();
    const ipAddress = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Anonimizza l'IP: prendi l'ultimo octetto (se disponibile)
    let lastOctet = "unknown";
    if (ipAddress) {
        const parts = ipAddress.split('.');
        if (parts.length >= 1) {
            lastOctet = parts[parts.length - 1].replace(/[^0-9]/g, '');
        }
    }
    
    // Crea il nome del file, includendo il timestamp e l'ultimo octetto
    const fileName = `capture_${timestamp.toISOString().replace(/[:.]/g, '-')}_${lastOctet}.${imageType}`;
    const filePath = path.join(capturesDir, fileName);
    console.log("Provo a salvare la foto in:", filePath);

    // Salva l'immagine nel formato corretto
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error("Errore nel salvataggio della foto:", err);
            return res.status(500).json({ message: 'Errore nel salvataggio' });
        }
        console.log("Foto salvata con successo:", filePath);

        // Prepara una voce di log aggiuntiva e salvala in access_log.txt
        const logFile = path.join(capturesDir, 'access_log.txt');
        const logEntry = `Timestamp: ${timestamp.toISOString()}
IP: ${ipAddress}
User-Agent: ${userAgent}
File: ${fileName}
------------------------
`;
        fs.appendFile(logFile, logEntry, (logErr) => {
            if (logErr) {
                console.error("Errore nel salvataggio del log:", logErr);
            } else {
                console.log("Log aggiornato in:", logFile);
            }
        });

        // Invia risposta di successo
        return res.status(200).json({ message: 'Foto salvata con successo' });
    });
});

// Rotta per servire il file index.html dal client
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
