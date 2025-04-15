const express = require('express');
const path = require('path');
const fs = require('fs');
const { uploadImage } = require('./utils/cloudinary');

const app = express();
const port = process.env.PORT || 10000;

// Middleware per il parsing dei dati JSON (per gestire la foto in Base64)
app.use(express.json({ limit: '10mb' }));

// Aggiungi una route per la home page
app.get('/', (req, res) => {
  res.send('Benvenuto nella Photo Capture App!');
});

app.post('/upload', async (req, res) => {
  try {
    console.log('Ricevuta richiesta POST per /upload');

    // Estrae i dati Base64 dal body (rimuovendo il prefisso)
    const base64Data = req.body.photo.replace(/^data:image\/png;base64,/, '');
    
    // Costruisce il percorso di salvataggio del file
    const filePath = path.join(__dirname, 'captures', `capture_${Date.now()}.png`);
    fs.writeFileSync(filePath, base64Data, 'base64');
    
    console.log(`Foto salvata con successo: ${filePath}`);

    // Carica l'immagine su Cloudinary
    const imageUrl = await uploadImage(filePath);
    console.log('Immagine caricata su Cloudinary con URL:', imageUrl);
    
    res.status(200).json({ message: 'Immagine caricata con successo', imageUrl });
  } catch (error) {
    console.error('Errore durante il caricamento della foto:', error);
    res.status(500).json({ error: 'Errore nel caricamento della foto' });
  }
});

app.listen(port, () => {
  console.log(`Server in esecuzione sulla porta ${port}`);
});
