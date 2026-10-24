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



return(
    <div className="flex justify-center flex-row" >
        <div>
            <h2>All Orders</h2>

            {Order.map((order) => (
                <div className="text-black" key={order._id}>
                    <p>Order ID: {order._id}</p>
                    <p>Customer ID: {order.userId}</p>
                    <p>Customer Name: {order.address?.fullName}</p>
                        {order.items.map((item, index) => (
                            <p key={index}>
                                Item: {item.productId?.title} × {item.quantity}
                            </p>
                        ))}
                    <p>Total: ₹{order.totalAmount}</p>
                    <p>Status: {order.status}</p>
                </div>
            ))}

            <button
                className="border cursor-pointer"
                onClick={() => navigate("/admin/products")}
            >
                Edit Products
            </button>
            
        </div>

    </div>
);

}