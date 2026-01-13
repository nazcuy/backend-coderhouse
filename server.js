const app = require('./src/app')
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`);
});