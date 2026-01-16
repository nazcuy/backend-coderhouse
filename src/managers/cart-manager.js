import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

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

  async create() {
    try {
      const carts = await this.getAll();
      const newCart = {
        id: uuidv4(),
        products: [],
      };
      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      throw error;
    }
  }

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

  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getAll();
      const cartIndex = carts.findIndex((c) => c.id === cartId);

      if (cartIndex === -1) throw new Error("Carrito no encontrado");
      const productIndex = carts[cartIndex].products.findIndex(
        (p) => p.product === productId
      );

      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity++;
      } else {
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