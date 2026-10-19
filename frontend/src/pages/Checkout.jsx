import { useState, useEffect } from "react";   
import api from "../api/axios";

export default function Checkout(){

    const userId = localStorage.getItem("userId");
    const [address, setAddress] = useState([]);
    const [cart, setCart] = useState(null);

    useEffect(()=>{

        api.get(`/cart/${userId}`).then((res) => setCart(res.data));
        api.get(`/address/${userId}`).then((res) => setAddress(res.data));

    }, []);

    if(!cart){
        return <div>Loading...</div>
    }

        const total = cart.items.reduce(
            (sum, i) => sum + i.quantity * (i.productId?.price || 0),
            0
        );

    return(

        <div className="">
            <h1 className="">Checkout</h1>
            <h2 className="">Select Address</h2>
            {
                address.map((addr) => (
                    <div
                        key={addr._id}
                        className=""
                    >
                        <p>{addr.fullName}</p>
                        <p>{addr.phone}</p>
                        <p>{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>

                    </div>
                ))
            }

            <h2 className="">Order Summary</h2>
            <p>Total Amount: ${total}</p>
                <button className="border cursor-pointer">
                    Place Order (COD)
                </button>
        </div>

    )

}


