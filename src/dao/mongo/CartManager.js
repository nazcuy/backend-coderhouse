import { CartModel } from "./models/cart.model.js";
import { ProductModel } from "./models/product.model.js";

export default class CartManager {

  async getAll() {
    try {
      const carts = await CartModel.find().lean();
      return carts;
    } catch (error) {
      throw new Error(`Error al leer carritos: ${error.message}`);
    }
  }

  async create() {
    try {
      const newCart = await CartModel.create({ products: [] });
      return newCart.toObject();
    } catch (error) {
      throw new Error(`Error al crear carrito: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const cart = await CartModel.findById(id).populate("products.product").lean();
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener carrito: ${error.message}`);
    }
  }

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

      const productIdStr = productId.toString();

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productIdStr
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();

      return await CartModel.findById(cartId).populate("products.product").lean();
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIdStr = productId.toString();

      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productIdStr
      );

      await cart.save();

      return await CartModel.findById(cartId).populate("products.product").lean();
    } catch (error) {
      throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
    }
  }

  async updateCartProducts(cartId, products) {
    try {
      if (!Array.isArray(products)) {
        throw new Error("El formato de productos debe ser un array");
      }

      for (const item of products) {
        if (!item.product || !item.quantity) {
          throw new Error("Cada producto debe tener ID y cantidad");
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

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (typeof quantity !== "number" || quantity < 1) {
        throw new Error("La cantidad debe ser un número mayor o igual a 1");
      }

      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIdStr = productId.toString();
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productIdStr
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
