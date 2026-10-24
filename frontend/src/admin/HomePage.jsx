import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


export default function AdminOrder(){

    const [Order, setOrder] = useState([]);
    const navigate = useNavigate();


    const loadOrder = async () => {
        try {
            const response = await api.get("/order/all");
            console.log(response.data);
            setOrder(response.data);
        } catch (error) {
            console.log("Error fetching orders:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        loadOrder();
    },[]);



return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">

            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        All Orders
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Manage and track customer orders
                    </p>
                </div>

                <button
                    className="  cursor-pointer rounded-lg bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
                    onClick={() => navigate("/admin/products")}
                >
                    Edit Products →
                </button>
            </div>

            {/* Order Count */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                    Total Orders
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                    {Order.length}
                </p>
            </div>

            {/* Orders List */}
            {Order.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                        No orders found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Customer orders will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-5">
                    {Order.map((order) => (
                        <div
                            key={order._id}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                            {/* Order Header */}
                            <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Order ID
                                    </p>
                                    <p className="mt-1 break-all font-semibold text-gray-800">
                                        {order._id}
                                    </p>
                                </div>

                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${
                                        order.status === "Delivered"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "Cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-amber-100 text-amber-700"
                                    }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            {/* Order Details */}
                            <div className="grid gap-6 p-5 md:grid-cols-2">

                                {/* Customer */}
                                <div>
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                        Customer Details
                                    </h3>

                                    <p className="font-semibold text-gray-900">
                                        {order.address?.fullName || "N/A"}
                                    </p>

                                    <p className="mt-1 break-all text-sm text-gray-500">
                                        Customer ID:{" "}
                                        {typeof order.userId === "object"
                                            ? order.userId?._id
                                            : order.userId}
                                    </p>

                                    {order.address?.phone && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            Phone: {order.address.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Products */}
                                <div>
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                        Ordered Items
                                    </h3>

                                    <div className="space-y-3">
                                        {order.items?.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {item.productId?.title ||
                                                            "Product unavailable"}
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>

                                                <p className="shrink-0 font-semibold text-gray-800">
                                                    ₹{(
                                                        (item.price || 0) *
                                                        (item.quantity || 0)
                                                    ).toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
                                <span className="font-medium text-gray-600">
                                    Order Total
                                </span>
                                <span className="text-xl font-bold text-gray-900">
                                    ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

}