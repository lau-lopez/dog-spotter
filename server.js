const express = require('express');
const path = require('path');
const app = express();

// Ruta a la carpeta generada por Angular
app.use(express.static(path.join(__dirname, 'dist/dog-spotter/browser')));

// Redirección para rutas no encontradas (Angular routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/dog-spotter/browser/index.html'));
});

// Usa el puerto que Heroku le asigne o el 8080 por defecto
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App corriendo en puerto ${port}`);
});
