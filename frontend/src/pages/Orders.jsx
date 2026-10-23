import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../api/axios";

const STATUS_COLORS = {
  Placed: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function Orders() {
  const userId = localStorage.getItem("userId");
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (!userId) return;
    api
      .get(`/order/${userId}`)
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Error loading orders:", err);
        setOrders([]);
      });
  }, [userId]);

  if (!userId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg mb-4">
          Please log in to view your orders.
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition"
        >
          Log In
        </Link>
      </div>
    );
  }

  if (!orders) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-10">
          <p className="text-5xl mb-4">📦</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            You haven't placed any orders yet. Start shopping!
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-xs transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        My Orders
      </h1>

      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
              <div>
                <p className="text-xs text-gray-500 font-mono">
                  Order ID: {order._id}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  ${order.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div
                  key={item._id || item.productId?._id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center p-1.5 shrink-0">
                    <img
                      src={item.productId?.image}
                      alt={item.productId?.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.productId?.title || "Product"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Qty: {item.quantity} × ${item.price?.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            {order.address && (
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Delivery Address
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{order.address.fullName}</span>{" "}
                  · {order.address.phone}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {order.address.addressLine}, {order.address.city},{" "}
                  {order.address.state} — {order.address.pincode}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

