const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configurazione di Cloudinary usando variabili d'ambiente
cloudinary.config({
  cloud_name: process.env.dzs4f4erb,
  api_key: process.env.666349749824897,
  api_secret: process.env.T47bQbChrnaXW4IeYkvnYlC5qnQ,
});

// Funzione per caricare l'immagine su Cloudinary
const uploadImage = async (filePath) => {
  try {
    console.log(`Caricamento dell'immagine da: ${filePath}`); // Log per verificare il percorso del file
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'prova', // Cartella su Cloudinary in cui salvare l'immagine
    });

    console.log('Immagine caricata con successo! URL:', result.secure_url); // Log dell'URL restituito da Cloudinary
    return result.secure_url;
  } catch (err) {
    console.error('Errore durante l\'upload su Cloudinary:', err); // Log di errore
    throw err;
  }
};

module.exports = { uploadImage };
