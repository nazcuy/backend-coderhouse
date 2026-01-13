const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(rutaArchivo) {
        this.rutaArchivo = path.resolve(rutaArchivo);
        this.productos = [];
        this.siguienteId = 1;
        this.inicializar();
    }

    async inicializar() {
        try {
            const datos = await fs.readFile(this.rutaArchivo, 'utf-8');
            this.productos = JSON.parse(datos);

            if (this.productos.length > 0) {
            }
        } catch (error) {
        }
    }
}
