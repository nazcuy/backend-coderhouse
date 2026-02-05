import { Router } from "express";
import ProductManager from "../managers/product-manager.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAll();
        res.render("home", {
            title: "Tienda Online - Home",
            products: products
        });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getAll();
        res.render("realTimeProducts", {
            title: "Productos en Tiempo Real",
            products: products
        });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

export default router;