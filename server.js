const express = require('express');
const path = require('path');
const fs = require('fs');
const { uploadImage } = require('./utils/cloudinary'); // Funzione di upload per Cloudinary

const app = express();
const port = process.env.PORT || 10000;

// Middleware per il parsing dei dati JSON (per la foto in base64)
app.use(express.json({ limit: '10mb' }));

// Endpoint per ricevere la foto e salvarla
app.post('/upload', async (req, res) => {
  try {
    console.log('Ricevuta richiesta POST per /upload');
    
    // Estrai la foto in formato base64 dalla richiesta
    const base64Data = req.body.photo.replace(/^data:image\/png;base64,/, ''); // Rimuovi il prefisso

    // Percorso dove salvare il file
    const filePath = path.join(__dirname, 'captures', `capture_${Date.now()}.png`);

    // Scrivi il file nel percorso specificato
    fs.writeFileSync(filePath, base64Data, 'base64');
    console.log(`Foto salvata con successo in: ${filePath}`);

    // Carica l'immagine su Cloudinary
    const imageUrl = await uploadImage(filePath);
    
    // Rispondi con l'URL dell'immagine su Cloudinary
    res.status(200).json({ message: 'Immagine caricata con successo', imageUrl: imageUrl });

  } catch (error) {
    console.error('Errore durante il caricamento della foto:', error);
    res.status(500).json({ error: 'Errore nel caricamento della foto' });
  }
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server in esecuzione sulla porta ${port}`);
});
