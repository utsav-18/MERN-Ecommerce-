import mongooe, { mongo } from "mongoose";

const OrderSchema = new mongooe.Schema({
  userId: {
    type: mongooe.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },

      quantity: Number,
      price: Number,
    },
  ],

  address: {
    fullName: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
  },

  totalAmount: Number,

  paymentMethod: {
    type: String,
    default: "COD",
  },

  status: {
    default: "Placed",
  },

  timestamps: true,
});

export default mongoose.model("Order", OrderSchema);
