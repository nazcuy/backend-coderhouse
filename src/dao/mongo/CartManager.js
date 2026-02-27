import { CartModel } from "./models/cart.model.js";
import { ProductModel } from "./models/product.model.js";

// ============================================
// CART MANAGER CON MONGODB (MONGOOSE)
// ============================================
// Implementación con MongoDB usando Mongoose y referencias

export default class CartManager {
  // ============================================
  // OBTENER TODOS LOS CARRITOS
  // ============================================

  async getAll() {
    try {
      const carts = await CartModel.find().lean();
      return carts;
    } catch (error) {
      throw new Error(`Error al leer carritos: ${error.message}`);
    }
  }

  // ============================================
  // CREAR UN NUEVO CARRITO
  // ============================================

  async create() {
    try {
      const newCart = await CartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear carrito: ${error.message}`);
    }
  }

  // ============================================
  // OBTENER UN CARRITO POR ID (CON POPULATE)
  // ============================================

  async getById(id) {
    try {
      const cart = await CartModel.findById(id).populate("products.product").lean();
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener carrito: ${error.message}`);
    }
  }

  // ============================================
  // AGREGAR PRODUCTO AL CARRITO
  // ============================================

  async addProductToCart(cartId, productId) {
    try {
      const productExists = await ProductModel.findById(productId);
      if (!productExists) {
        throw new Error("Producto no encontrado");
      }

      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1,
        });
      }

      await cart.save();
      
      return await CartModel.findById(cartId).populate("products.product").lean();
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  // ============================================
  // ELIMINAR PRODUCTO DEL CARRITO
  // ============================================
  // DELETE /api/carts/:cid/products/:pid

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = cart.products.filter(
        (p) => p.product.toString() !== productId
      );

      await cart.save();
      
      return await CartModel.findById(cartId).populate("products.product").lean();
    } catch (error) {
      throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
    }
  }

  // ============================================
  // ACTUALIZAR TODOS LOS PRODUCTOS DEL CARRITO
  // ============================================
  // PUT /api/carts/:cid

  async updateCartProducts(cartId, products) {
    try {
      if (!Array.isArray(products)) {
        throw new Error("El formato de productos debe ser un array");
      }

      for (const item of products) {
        if (!item.product || !item.quantity) {
          throw new Error("Cada producto debe tener 'product' (ID) y 'quantity'");
        }
        const productExists = await ProductModel.findById(item.product);
        if (!productExists) {
          throw new Error(`Producto con ID ${item.product} no encontrado`);
        }
      }

      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products },
        { new: true }
      ).populate("products.product").lean();

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar carrito: ${error.message}`);
    }
  }

  // ============================================
  // ACTUALIZAR CANTIDAD DE UN PRODUCTO
  // ============================================
  // PUT /api/carts/:cid/products/:pid

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (typeof quantity !== "number" || quantity < 1) {
        throw new Error("La cantidad debe ser un número mayor o igual a 1");
      }

      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }

      cart.products[productIndex].quantity = quantity;
      await cart.save();

      return await CartModel.findById(cartId).populate("products.product").lean();
    } catch (error) {
      throw new Error(`Error al actualizar cantidad: ${error.message}`);
    }
  }

  // ============================================
  // ELIMINAR TODOS LOS PRODUCTOS DEL CARRITO
  // ============================================
  // DELETE /api/carts/:cid

  async clearCart(cartId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      ).populate("products.product").lean();

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      return cart;
    } catch (error) {
      throw new Error(`Error al vaciar carrito: ${error.message}`);
    }
  }

  // ============================================
  // ELIMINAR UN CARRITO COMPLETAMENTE
  // ============================================

  async delete(cartId) {
    try {
      const deletedCart = await CartModel.findByIdAndDelete(cartId);
      if (!deletedCart) {
        throw new Error("Carrito no encontrado");
      }
      return { message: "Carrito eliminado exitosamente" };
    } catch (error) {
      throw new Error(`Error al eliminar carrito: ${error.message}`);
    }
  }
}
