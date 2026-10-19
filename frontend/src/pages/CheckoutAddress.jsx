import { useState, useEffect } from "react";
import api from '../api/axios';
import { useNavigate, Link } from 'react-router';

export default function CheckoutAddress(){

    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [existingAddresses, setExistingAddresses] = useState([]);

    const [form, setForm] = useState({
        fullName:  "",
        phone : "",
        addressLine : "", 
        city : "",
        state : "",
        pincode : ""
    });

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }
        api.get(`/address/${userId}`)
            .then((res) => {
                setExistingAddresses(res.data || []);
            })
            .catch((err) => console.error(err));
    }, [userId, navigate]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    }

    const saveAddress = async (e) => {
        if (e) e.preventDefault();

        if(!form.fullName || !form.phone || !form.addressLine || !form.city || !form.state || !form.pincode){
            alert("Please fill in all address fields.");
            return;
        }

        try {
            setLoading(true);
            await api.post("/address/add",{
                ...form,
                userId,
            });
            navigate("/checkout");
        } catch(err) {
            console.error("Error saving address:", err);
            alert("Failed to save address. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
            <Link 
                to="/cart" 
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 font-medium mb-6 transition"
            >
                ← Back to Cart
            </Link>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {existingAddresses.length > 0 ? "Add New Address" : "Delivery Address"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {existingAddresses.length > 0 
                            ? "Fill out the form below to add another delivery address." 
                            : "Please enter your shipping address to proceed with checkout."}
                    </p>
                </div>

                {existingAddresses.length > 0 && (
                    <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-blue-900">
                                You have {existingAddresses.length} saved {existingAddresses.length === 1 ? "address" : "addresses"}.
                            </p>
                            <p className="text-xs text-blue-700 mt-0.5">
                                You can choose a previously saved address instead of adding a new one.
                            </p>
                        </div>
                        <Link 
                            to="/checkout"
                            className="inline-flex items-center justify-center text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shrink-0"
                        >
                            Select Existing Address →
                        </Link>
                    </div>
                )}

                <form onSubmit={saveAddress} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                                Full Name
                            </label>
                            <input 
                                name="fullName" 
                                type="text"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                                Phone Number
                            </label>
                            <input 
                                name="phone" 
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                            Street Address / House No.
                        </label>
                        <input 
                            name="addressLine" 
                            type="text"
                            value={form.addressLine}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                                City
                            </label>
                            <input 
                                name="city" 
                                type="text"
                                value={form.city}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                                State
                            </label>
                            <input 
                                name="state" 
                                type="text"
                                value={form.state}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                                PIN Code
                            </label>
                            <input 
                                name="pincode" 
                                type="text"
                                value={form.pincode}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl shadow-xs transition active:scale-[0.98] cursor-pointer mt-6 disabled:opacity-60"
                    >
                        {loading ? "Saving Address..." : "Save Address & Proceed to Checkout"}
                    </button>
                </form>
            </div>
        </div>
    )
}