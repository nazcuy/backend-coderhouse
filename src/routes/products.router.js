import { Router } from "express";
import ProductManager from "../managers/product-manager.js";

const router = Router();
// Instanciamos el manager indicando dónde queremos guardar los productos
const manager = new ProductManager("./products.json");

// 1. Obtener todos los productos (GET /)
router.get("/", async (req, res) => {
    try {
        const products = await manager.getAll();
        // Agregamos el soporte para ?limit= (ej: /api/products?limit=5)
        const { limit } = req.query;
        if (limit) {
            return res.json(products.slice(0, limit));
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Obtener un producto por ID (GET /:pid)
router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params; // Obtenemos el ID de la URL
        const product = await manager.getById(pid);
        
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Crear un nuevo producto (POST /)
router.post("/", async (req, res) => {
    try {
        // req.body contiene los datos que envía el cliente (Postman)
        const newProduct = await manager.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. Actualizar un producto (PUT /:pid)
router.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await manager.update(pid, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// 5. Eliminar un producto (DELETE /:pid)
router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        await manager.delete(pid);
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;