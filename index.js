// src/index.js

const express = require('express');
const multer = require('multer');
const fs = require('fs');

const { uploadImage } = require('./utils/cloudinary');

const app = express();
const PORT = process.env.PORT || 3000;

// Salvataggio temporaneo dei file nella cartella /tmp (funziona su Render)
const upload = multer({ dest: '/tmp/' });

app.get('/', (req, res) => {
  res.send('✅ Server attivo! Fai POST su /upload con un\'immagine.');
});

app.post('/upload', upload.single('image'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const imageUrl = await uploadImage(filePath);
    fs.unlinkSync(filePath); // Elimina il file temporaneo
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: 'Errore durante l\'upload.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server attivo su http://localhost:${PORT}`);
});
