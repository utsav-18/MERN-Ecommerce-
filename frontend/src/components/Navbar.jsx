import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Navbar(){
    const navigate = useNavigate();
    const [cartCount, setCount] = useState(0);
    const userId = localStorage.getItem("userId");

    useEffect(()=>{
        const loadCart = async () => {
            if(!userId) return setCount(0);
            try {
                const res = await api.get(`/cart/${userId}`);
                const total = res.data.items.reduce(
                    (sum,item) => sum + item.quantity, 0
                );
                setCount(total);
            } catch (err) {
                console.error("Error loading cart count:", err);
            }
        }

        loadCart();
        window.addEventListener("cartUpdated", loadCart);

        return () => {
            window.removeEventListener("cartUpdated", loadCart);
        }
    },[userId]);

    const logout = () => {
        localStorage.clear();
        setCount(0);
        navigate('/login');
    }

    return(
        <nav className='sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-xs'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center'>
                <Link to="/" className='flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-blue-600 transition'>
                    <span>🍎</span>
                    <span className='tracking-tight'>Apple Store</span>
                </Link>

                <div className='flex gap-4 items-center'>
                    <Link 
                        to="/cart" 
                        className='relative p-2 text-gray-700 hover:text-blue-600 transition flex items-center'
                        title="Cart"
                    >
                        <span className='text-2xl'>🛒</span>
                        {
                            cartCount > 0 && (
                                <span className='absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold min-w-5 h-5 flex items-center justify-center rounded-full px-1 shadow-xs'>
                                    {cartCount}
                                </span>
                            )
                        }
                    </Link>

                    {
                        !userId ? (
                            <div className='flex items-center gap-2'>
                                <Link 
                                    to='/login' 
                                    className='text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition'
                                >
                                    Login
                                </Link>
                                <Link 
                                    to='/signup' 
                                    className='text-sm font-medium bg-blue-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-blue-700 transition shadow-xs'
                                >
                                    Signup
                                </Link>
                            </div>
                        ) : (
                            <button 
                                onClick={logout} 
                                className='text-sm font-medium text-red-600 hover:text-white hover:bg-red-500 border border-red-200 px-3 py-1.5 rounded-lg cursor-pointer transition'
                            >
                                Logout
                            </button>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}