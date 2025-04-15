if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.dzs4f4erb,
  api_key: process.env.666349749824897,
  api_secret: process.env.T47bQbChrnaXW4IeYkvnYlC5qnQ,
});

// Carica l'immagine nella cartella 'prova'
const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'prova', // 👈 qui specifichiamo la cartella
    });
    return result.secure_url;
  } catch (err) {
    console.error('Errore durante l\'upload su Cloudinary:', err);
    throw err;
  }
};

module.exports = {
  uploadImage,
};
