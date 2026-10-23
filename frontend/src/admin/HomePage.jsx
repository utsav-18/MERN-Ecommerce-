import { useEffect, useState } from "react";
import api from "../api/axios";


export default function AdminOrder(){

    const [Order, setOrder] = useState([]);

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
                    <p>Total: ₹{order.totalAmount}</p>
                    <p>Status: {order.status}</p>
                </div>
            ))}
        </div>
    </div>
);

}