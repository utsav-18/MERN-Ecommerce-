import {Link, useNavigate} from 'react-router';
import {useState, useEffect, useId} from "react";
import api from "../api/axios";

export default function Navbar(){
    const navigate = useNavigate();
    const [cartCount, setCount] = useState(0);
    const userId = localStorage.getItem("userId");

    useEffect(()=>{

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
                            <Link to='/signup' className='text-lg'>Register</Link>
                        </>
                    ) : (
                        <button onClick={logout} className='text-lg'> LogOut </button>
                    )
                }

            </div>

        </nav>
    )
}