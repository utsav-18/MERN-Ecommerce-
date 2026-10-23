import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";

export default function Checkout() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [address, setAddress] = useState([]);
  const [cart, setCart] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    api
      .get(`/cart/${userId}`)
      .then((res) => setCart(res.data))
      .catch((err) => console.error(err));

    api
      .get(`/address/${userId}`)
      .then((res) => {
        const addrs = res.data || [];
        setAddress(addrs);
        if (addrs.length === 0) {
          navigate("/checkout-address");
        } else {
          setSelectedAddressId(addrs[addrs.length - 1]._id || addrs[0]._id);
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/checkout-address");
      });
  }, [userId, navigate]);

  if (!cart) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
        Loading checkout details...
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, i) => sum + i.quantity * (i.productId?.price || 0),
    0
  );

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select or add a delivery address.");
      return;
    }

    const chosenAddr = address.find((a) => a._id === selectedAddressId);
    if (!chosenAddr) {
      alert("Selected address not found. Please try again.");
      return;
    }

    try {
      setPlacing(true);
      setFinalTotal(total);

      // Call the backend order route — it creates the order, deducts stock, and clears the cart
      const res = await api.post("/order/place", {
        userId,
        address: {
          fullName: chosenAddr.fullName,
          phone: chosenAddr.phone,
          addressLine: chosenAddr.addressLine,
          city: chosenAddr.city,
          state: chosenAddr.state,
          pincode: chosenAddr.pincode,
        },
      });

      setOrderId(res.data.orderId);

      // Update local state & navbar badge
      setCart((prev) => ({ ...prev, items: [] }));
      localStorage.setItem("cartCount", "0");
      window.dispatchEvent(new Event("cartUpdated"));

      setOrderPlaced(true);
    } catch (err) {
      console.error("Error placing order:", err);
      alert(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    const chosenAddr = address.find((a) => a._id === selectedAddressId);
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-8 sm:p-12">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            ✓
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-1">
            Thank you for your purchase. Your order has been placed successfully
            via Cash on Delivery.
          </p>
          {orderId && (
            <p className="text-xs text-gray-400 mb-6 font-mono">
              Order ID: {orderId}
            </p>
          )}

          {chosenAddr && (
            <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-700 border border-gray-200 mb-6">
              <p className="font-semibold text-gray-900">Delivering to:</p>
              <p className="font-medium mt-1">
                {chosenAddr.fullName} ({chosenAddr.phone})
              </p>
              <p className="text-gray-600">
                {chosenAddr.addressLine}, {chosenAddr.city}, {chosenAddr.state}{" "}
                - {chosenAddr.pincode}
              </p>
              <p className="mt-2 font-semibold text-gray-900">
                Amount to pay upon delivery: ${finalTotal.toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/orders"
              className="inline-block border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl transition"
            >
              View My Orders
            </Link>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl shadow-xs transition active:scale-[0.98] cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-8">
          <p className="text-5xl mb-4">🛒</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            There are no items to checkout.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-xs transition"
          >
            Go to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 font-medium mb-6 transition"
      >
        ← Back to Cart
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: Addresses & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Selection Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Delivery Address
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select where you'd like your order delivered
                </p>
              </div>
              <Link
                to="/checkout-address"
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                + Add New Address
              </Link>
            </div>

            {address.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6">
                <p className="text-gray-600 text-sm mb-3">
                  No delivery address saved yet.
                </p>
                <Link
                  to="/checkout-address"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  Add Delivery Address
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {address.map((addr) => {
                  const isSelected = selectedAddressId === addr._id;
                  return (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={isSelected}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 text-sm">
                            {addr.fullName}
                          </p>
                          <span className="text-xs text-gray-500 font-mono">
                            {addr.phone}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                          {addr.pincode}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-7">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Payment Method
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Choose how you want to pay
            </p>

            <div className="p-4 rounded-xl border border-blue-600 bg-blue-50/40 flex items-start gap-3.5">
              <input
                type="radio"
                name="paymentMethod"
                defaultChecked
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 text-sm">
                    Cash on Delivery (COD)
                  </p>
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                    Available
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Pay with cash upon receiving your order at your doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Sticky Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sticky top-24 space-y-5">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h2>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.items.map((i) => (
                <div
                  key={i.productId?._id || Math.random()}
                  className="flex items-center justify-between text-sm gap-3"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={i.productId?.image}
                      alt={i.productId?.title}
                      className="w-10 h-10 object-contain rounded bg-gray-50 p-1 border border-gray-100 shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {i.productId?.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {i.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">
                    ${((i.productId?.price || 0) * i.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-2">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placing || address.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow-xs transition active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placing ? "Placing Order..." : "Place Order (COD)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
