import { Router } from "express";

//FileSystem:
//import CartManager from "../dao/fs/cart-manager.js";
//const manager = new CartManager("./data/carts.json");

//MongoDB:
import CartManager from "../dao/mongo/CartManager.js";
const manager = new CartManager();

const router = Router();


router.post("/", async (req, res) => {
    try {
        const newCart = await manager.create();
        res.status(201).json({
            status: "success",
            payload: { ...newCart, message: "Carrito creado exitosamente" },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await manager.getById(cid);
        
        if (!cart) return res.status(404).json({
            status: "error",
            error: "Carrito no encontrado" });
        
        res.json({
            status: "success",
            payload: {  ...cart, message: "Carrito encontrado exitosamente" },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await manager.addProductToCart(cid, pid);
        res.json({
            status: "success",
            payload: { ...cart, message: "Producto agregado al carrito exitosamente" },
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await manager.removeProductFromCart(cid, pid);
        res.json({
        status: "success",
        payload: { ...cart, message: "Producto eliminado del carrito exitosamente" },
        });
    } catch (error) {
        res.status(404).json({
        status: "error",
        error: error.message,
        });
    }
    });

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        if (!products) {
        return res.status(400).json({
            status: "error",
            error: "Debe proporcionar un array de productos",
        });
        }
        const cart = await manager.updateCartProducts(cid, products);
        res.json({
        status: "success",
        payload: { ...cart, message: "Carrito actualizado correctamente" },
        });
    } catch (error) {
        res.status(400).json({
        status: "error",
        error: error.message,
        });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if (quantity === undefined || quantity === null) {
        return res.status(400).json({
            status: "error",
            error: "Debe proporcionar la cantidad",
        });
        }
        const cart = await manager.updateProductQuantity(cid, pid, parseInt(quantity));
        res.json({
        status: "success",
        payload: { ...cart, message: "Cantidad actualizada correctamente" },
        });
    } catch (error) {
        res.status(400).json({
        status: "error",
        error: error.message,
        });
    }
    });

    router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await manager.clearCart(cid);
        res.json({
        status: "success",
        payload: { ...cart, message: "Carrito vaciado exitosamente" },
        });
    } catch (error) {
        res.status(404).json({
        status: "error",
        error: error.message,
        });
    }
});

export default router;