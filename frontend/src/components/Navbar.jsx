import {Link, useNavigate} from 'react-router';
import {useState, useEffect, useId} from "react";
import api from "../api/axios";

export default function Navbar(){
    const navigate = useNavigate();
    const [cartCount, setCount] = useState(0);
    const userId = localStorage.getItem("userId");

    useEffect(()=>{
        
        const loadCart = async () => {
            if(!userId) return setCount(0);
            const res = await api.get(`/cart/${userId}`);
            const total = res.data.items.reduce(
                (sum,item) => sum + item.quantity, 0
            );
            setCount(total);
        }

        loadCart();
        window.addEventListener("cartUpdated", loadCart);

        return () => {
            window.removeEventListener("cartUpdted", loadCart);
        }

    },[userId]);

    const logout = () => {
        localStorage.clear();
        setCount(0);
        navigate('/login');
    }

    return(
        <nav className='flex justify-between p-4 shadow'>
            <Link to ="/" className='font-bold text-xl'>Apple Store</Link>

            <div className='flex gap-4 items-center'>

                <Link to = "/cart" className='relative text-xl'>
                    🛒
                    {
                        cartCount > 0 && (
                            <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded'>
                                {cartCount}
                            </span>
                        )
                    }
                </Link>

                {
                    !userId ?(
                        <>
                            <Link to ='/login' className='text-lg'>Login</Link>
                            <Link to='/signup' className='text-lg'>Signup</Link>
                        </>
                    ) : (
                        <button onClick={logout} className='text-lg'> Logout </button>
                    )
                }

            </div>

        </nav>
    )
}