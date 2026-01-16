import { Router } from "express";
import CartManager from "../managers/cart-manager.js";

const router = Router();
const manager = new CartManager("./data/carts.json");

router.post("/", async (req, res) => {
    try {
        const newCart = await manager.create();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await manager.getById(cid);
        
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        
        res.json(cart.products); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await manager.addProductToCart(cid, pid);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;