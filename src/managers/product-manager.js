import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default class ProductManager {
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
      throw new Error(`Error al leer el archivo: ${error}`);
    }
  }

  async getById(id) {
    try {
      const products = await this.getAll();
      const product = products.find((p) => p.id === id);
      if (!product) return null; // Retornamos null si no existe para manejarlo en el router
      return product;
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error}`);
    }
  }

  async create(obj) {
    try {
      const products = await this.getAll();
      
      // Validamos que estén todos los campos obligatorios
      if (!obj.title || !obj.description || !obj.code || !obj.price || !obj.stock || !obj.category) {
         throw new Error("Todos los campos son obligatorios (excepto thumbnails)");
      }

      const newProduct = {
        id: uuidv4(),
        status: true, // Por defecto true según la consigna
        thumbnails: obj.thumbnails || [], // Si no viene, array vacío
        ...obj
      };

      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  async update(id, obj) {
    try {
      const products = await this.getAll();
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) throw new Error("Producto no encontrado");

      // Nos aseguramos que NO se actualice el ID
      const { id: newId, ...updateData } = obj; 
      
      products[index] = { ...products[index], ...updateData };
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return products[index];
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const products = await this.getAll();
      const newProducts = products.filter((p) => p.id !== id);
      
      if (products.length === newProducts.length) throw new Error("Producto no encontrado");

      await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2));
      return { message: "Producto eliminado" };
    } catch (error) {
      throw error;
    }
  }
}
