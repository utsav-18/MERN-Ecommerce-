import {useState, useEffect, useId} from "react";
import api from "../api/axios";

export default function Cart() {
    const userId = localStorage.getItem('userId');
    const [cart, setCart] = useState(null);

    //load cart
    const loadCart = async () => {
        if(!userId) return;
        const res = await api.get(`/cart/${userId}`);
        setCart(res.data);
    };

    useEffect(()=>{
        loadCart();
    },[]);

    //remove item
    const removeItem = async (productId) => {
        await api.post(`/cart/remove`, {userId,productId});
        loadCart();
        window.dispatchEvent(new Event('cartUpdated'));
    }

    //update item quantity
    const updateQuantity = async (productId, quantity) => {
        
        if(quantity===0){
            await removeItem(productId);
            return;
        }
        else{
            await api.post(`/cart/update`, {userId, productId, quantity});
            loadCart();
            window.dispatchEvent(new Event('CartUpdated'));
        }

        if(!cart){
            return <div>Loading...</div>
        }

        const total  =cart.item.reduce((sum,item) => sum + item.productId.price * item.quantity, 0);

    }


    return(
        <div className="max-w-4xl mx-auto p-6">

        </div>
    )

    
}