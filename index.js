// src/index.js

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { uploadImage } = require('./utils/cloudinary');

const app = express();
const PORT = process.env.PORT || 3000;

// Multer: salva temporaneamente i file in /tmp
const upload = multer({ dest: '/tmp/' });

app.get('/', (req, res) => {
  res.send('Server attivo! Usa POST /upload per caricare un\'immagine.');
});

app.post('/upload', upload.single('image'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const imageUrl = await uploadImage(filePath);

    // Elimina il file temporaneo
    fs.unlinkSync(filePath);

    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: 'Errore durante l\'upload.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
