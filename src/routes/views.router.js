import { Router } from "express";

//FileSystem:
//import ProductManager from "../dao/fs/product-manager.js";
//const productManager = new ProductManager("./data/products.json");

//MongoDB:
import ProductManager from "../dao/mongo/ProductManager.js";
import CartManager from "../dao/mongo/CartManager.js";
const productManager = new ProductManager();
const cartManager = new CartManager();

const router = Router();

router.get("/", async (req, res) => {
    try {
        const result = await productManager.getAll({ limit: 100 });
        res.render("home", {
        title: "Tienda Online - Home",
        products: result.payload,
        });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
    });

router.get("/products", async (req, res) => {
    try {
        const { limit, page } = req.query;
        const result = await productManager.getAll({
        limit: limit || 10,
        page: page || 1,
        });
        res.render("products", {
        title: "Productos - Tienda Online",
        products: result.payload,
        hasPrev: result.hasPrevPage,
        hasNext: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        currentPage: result.page,
        totalPages: result.totalPages,
        });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
    });

router.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getById(pid);

        if (!product) {
        return res.status(404).render("error", {
            error: "Producto no encontrado",
        });
        }

        res.render("productDetail", {
        title: `${product.title} - Tienda Online`,
        product,
        });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
    });

router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getById(cid);

        if (!cart) {
        return res.status(404).render("error", {
            error: "Carrito no encontrado",
        });
        }

        res.render("cart", {
        title: `Carrito ${cid} - Tienda Online`,
        cartId: cid,
        products: cart.products,
        total: cart.products.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0,
        ),
        });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
    });

router.get("/realtimeproducts", async (req, res) => {
    try {
        const result = await productManager.getAll({ limit: 100 });
        res.render("realTimeProducts", {
        title: "Productos en Tiempo Real",
        products: result.payload,
        });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

export default router;
