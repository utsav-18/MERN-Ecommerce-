import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import { useNavigate } from "react-router";


export default function Cart() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  // Load cart
  const loadCart = async () => {
    if (!userId) {
      setCart({ items: [] });
      return;
    }

    try {
      const res = await api.get(`/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error("Error loading cart:", err);
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Remove item
  const removeItem = async (productId) => {
    await api.post("/cart/remove", { userId, productId });
    await loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    await api.post("/cart/update", { userId, productId, quantity });
    await loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Prevent accessing cart before it loads
  if (!cart) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
        Loading cart...
      </div>
    );
  }

  // Calculate total
  const total = cart.items.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0,
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 shadow-xs gap-3 flex flex-col items-center">
          
          <img src="https://cdn.pixabay.com/photo/2015/12/23/01/14/edit-1105049_1280.png" className='h-20' />

          <h2 className="text-xl font-semibold text-gray-800">Your cart is currently empty</h2>
          <p className="text-gray-500 text-sm mt-1 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-xs transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div
                key={item.productId._id}
                className="bg-white flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 border border-gray-200 rounded-xl shadow-xs gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg p-1.5 flex items-center justify-center shrink-0 border border-gray-100">
                    <img
                      src={item.productId.image}
                      alt={item.productId.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-gray-900 line-clamp-1">
                      {item.productId.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      ${item.productId.price?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                    <button
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition cursor-pointer font-bold"
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity - 1)
                      }
                      title="Decrease"
                    >
                      -
                    </button>

                    <span className="w-9 text-center text-sm font-semibold text-gray-800">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition cursor-pointer font-bold"
                      title="Increase"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <p className="font-bold text-gray-900">
                      ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    className="text-sm text-red-500 hover:text-red-700 hover:underline cursor-pointer font-medium"
                    onClick={() => removeItem(item.productId._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Total amount</p>
              <h2 className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</h2>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/"
                className="text-center px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition text-sm flex-1 sm:flex-initial"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => navigate("/checkout-address")}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-xs transition text-sm flex-1 sm:flex-initial"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
