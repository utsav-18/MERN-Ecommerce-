import { useState } from "react";
import {useNavigate} from "react-router";
import api from "../api/axios";

export default function LogIn(){
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const [msg, setMsg] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange=(e)=>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
    }

    const handSubmit=async(e)=>{
        e.preventDefault();
        try{

            const res = await api.post("/auth/login",form);
            console.log(res,"data")

            //Save Token to localStorage
            localStorage.setItem("token", res.data.token);

            setMsg("Log In Successfull");
            setIsSuccess(true);

            //Redirect to home page after 1 sec
            setTimeout(()=>{
                navigate("/");
            },1000);


        }catch(err){
            setMsg(err.response?.data?.message || "An Error Occured");
            setIsSuccess(false);
        }
    }

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to your account</h2>
                {msg && (
                    <div
                        className={`mb-4 text-center text-sm font-medium ${
                            isSuccess ? "text-blue-600" : "text-red-600"
                        }`}
                    >
                        {msg}
                    </div>
                )}

                <form onSubmit={handSubmit} className="space-y-4">
                    <input 
                        name='email'
                        type='email'
                        placeholder='Enter Email'
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none"
                        required
                    />
                    <input 
                        name='password'
                        type='password'
                        placeholder='Enter Password'
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none"
                        required
                    />
                    <button type="submit" className="cursor-pointer w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-colors">
                        Log In
                    </button>
                </form>

                <button className="bg-red-400 rounded-full mt-5 p-3 items-center cursor-pointer hover:bg-red-500 text-white"  onClick={() => navigate("/")}>
                   Cancel
                </button>

            </div>
        </div>
    )

}
