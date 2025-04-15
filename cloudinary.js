// src/utils/cloudinary.js

// Carica le variabili d'ambiente da .env (solo in locale)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const cloudinary = require('cloudinary').v2;

// Configurazione usando le variabili d’ambiente
cloudinary.config({
  cloud_name: process.env.dzs4f4erb,
  api_key: process.env.666349749824897,
  api_secret: process.env.T47bQbChrnaXW4IeYkvnYlC5qnQ,
});

// Funzione helper per caricare un’immagine
const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'render_uploads', // opzionale: organizza le immagini in una cartella su Cloudinary
    });
    return result.secure_url;
  } catch (err) {
    console.error('Errore durante l\'upload su Cloudinary:', err);
    throw err;
  }
};

module.exports = {
  cloudinary,
  uploadImage,
};
