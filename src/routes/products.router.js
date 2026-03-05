import { Router } from "express";

//FileSystem:
//import ProductManager from "../dao/fs/product-manager.js";
//const manager = new ProductManager("./data/products.json");

//MongoDB:
import ProductManager from "../dao/mongo/ProductManager.js";
const manager = new ProductManager();

const router = Router();


router.get("/", async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        const result = await manager.getAll({
            limit: limit || 10,
            page: page || 1,
            sort: sort || 1,
            query: query || null,
        });
        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await manager.getById(pid);
        
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });
        
        res.json({
            status: "success",
            payload: { ...product, message: "Producto encontrado exitosamente" },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = await manager.create(req.body);
        req.io.emit("newProduct", newProduct);
        res.status(201).json({
            status: "success",
            payload: { ...newProduct, message: "Producto creado exitosamente" },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await manager.update(pid, req.body);
        req.io.emit("updateProduct", updatedProduct);
        res.json({
            status: "success",
            payload: { ...updatedProduct, message: "Producto actualizado exitosamente" },
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await manager.delete(pid);
        req.io.emit("deleteProduct", pid);
        res.json({
            status: "success",
            payload: { ...result, message: "Producto eliminado exitosamente" },
    });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;