import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  // 1. Leer todos los carritos (auxiliar para uso interno)
  async getAll() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(`Error al leer carritos: ${error}`);
    }
  }

  // 2. Crear un carrito nuevo (POST /)
  async create() {
    try {
      const carts = await this.getAll();
      const newCart = {
        id: uuidv4(),
        products: [], // Empieza vacío
      };
      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  // 3. Obtener un carrito por ID (GET /:cid)
  async getById(id) {
    try {
      const carts = await this.getAll();
      const cart = carts.find((c) => c.id === id);
      if (!cart) return null;
      return cart;
    } catch (error) {
      throw error;
    }
  }

  // 4. Agregar producto al carrito (POST /:cid/product/:pid)
  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getAll();
      const cartIndex = carts.findIndex((c) => c.id === cartId);

      if (cartIndex === -1) throw new Error("Carrito no encontrado");

      // Verificamos si el producto ya existe DENTRO del carrito
      const productIndex = carts[cartIndex].products.findIndex(
        (p) => p.product === productId
      );

      if (productIndex !== -1) {
        // Si existe, sumamos la cantidad
        carts[cartIndex].products[productIndex].quantity++;
      } else {
        // Si no existe, lo agregamos con quantity: 1
        carts[cartIndex].products.push({
          product: productId,
          quantity: 1,
        });
      }

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return carts[cartIndex];
    } catch (error) {
      throw error;
    }
  }
}