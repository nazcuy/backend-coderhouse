import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import 'dotenv/config';
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import morgan from "morgan";

const app = express();
const PORT = 8080;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  });


app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(express.static("public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor HTTP en http://localhost:${PORT}`);
  console.log(`WebSocket activo en http://localhost:${PORT}`);
  console.log(`Vistas disponibles en http://localhost:${PORT}/products`);
});