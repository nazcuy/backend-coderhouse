import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const PORT = 8080;

// Middleware para que Express entienda JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectamos los Routers
// Todo lo que empiece con /api/products se deriva al router de productos
app.use("/api/products", productsRouter);

// Todo lo que empiece con /api/carts se deriva al router de carritos
app.use("/api/carts", cartsRouter);

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});