import { Router } from "express";
import ProductManager from "../managers/product-manager.js";

const router = Router();
const manager = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
    try {
        const products = await manager.getAll();
        const { limit } = req.query;
        if (limit) {
            return res.json(products.slice(0, limit));
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await manager.getById(pid);
        
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = await manager.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await manager.update(pid, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

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