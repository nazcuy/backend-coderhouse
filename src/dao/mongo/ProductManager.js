import { ProductModel } from "./models/product.model.js";
export default class ProductManager {
  async getAll({ limit = 10, page = 1, sort, query } = {}) {
    try {
      limit = parseInt(limit);
      page = parseInt(page);

      let filter = {};

      if (query) {
        if (query === "available") {
          filter.stock = { $gt: 0 };
        } else {
          filter.category = { $regex: query, $options: "i" };
        }
      }

      let sortOption = {};
      if (sort === "asc") {
        sortOption.price = 1;
      } else if (sort === "desc") {
        sortOption.price = -1;
      }

      const options = {
        page,
        limit,
        sort: sortOption,
        lean: true,
      };

      const result = await ProductModel.paginate(filter, options);

      return {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `/api/products?limit=${limit}&page=${result.prevPage}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
          : null,
        nextLink: result.hasNextPage
          ? `/api/products?limit=${limit}&page=${result.nextPage}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
          : null,
      };
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const product = await ProductModel.findById(id).lean();
      return product;
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  async create(obj) {
    try {
      const requiredFields = ["title", "description", "code", "price", "stock", "category"];
      for (const field of requiredFields) {
        if (!obj[field]) {
          throw new Error(`El campo ${field} es obligatorio`);
        }
      }

      const newProduct = await ProductModel.create(obj);
      return newProduct;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Ya existe un producto con ese código");
      }
      throw error;
    }
  }

  async update(id, obj) {
    try {
      const { _id, id: objId, code, ...updateData } = obj;

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!updatedProduct) {
        throw new Error("Producto no encontrado");
      }

      return updatedProduct;
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        throw new Error("Producto no encontrado");
      }

      return { message: "Producto eliminado exitosamente" };
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}
