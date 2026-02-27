import mongoose from "mongoose";

// ============================================
// MODELO DE CARRITO CON MONGOOSE
// ============================================
// El carrito tiene un array de productos donde cada elemento
// tiene una referencia al modelo Product (populate)

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "La cantidad mínima es 1"],
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Populate automático
cartSchema.pre("find", function () {
  this.populate("products.product");
});

cartSchema.pre("findOne", function () {
  this.populate("products.product");
});

cartSchema.pre("findById", function () {
  this.populate("products.product");
});

export const CartModel = mongoose.model("Cart", cartSchema);
