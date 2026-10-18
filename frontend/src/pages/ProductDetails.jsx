import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, Link } from "react-router";

export default function ProductDetails(){
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [adding, setAdding] = useState(false);

    const loadProduct = async () => {
        const res = await api.get("/products/");
        const p = res.data.find((item) => item._id == id);
        setProduct(p);
    };

    useEffect(() => {
        loadProduct();
    }, [id]);

    const handleAddToCart = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Please log in to add items to your cart.");
            return;
        }

        try {
            setAdding(true);
            await api.post("/cart/add", { userId, productId: product._id });
            window.dispatchEvent(new Event("cartUpdated"));
            alert("Added to cart successfully!");
        } catch (err) {
            console.error("Error adding to cart:", err);
            alert("Failed to add to cart");
        } finally {
            setAdding(false);
        }
    };

    if(!product){
        return (
            <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
                Loading product details...
            </div>
        );
    }

    return(
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link 
                to="/" 
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 font-medium mb-6 transition"
            >
                ← Back to Products
            </Link>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center min-h-[280px]">
                    <img 
                        src={product.image} 
                        alt={product.title} 
                        className="max-h-72 max-w-full object-contain"
                    />
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        {product.category && (
                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                                {product.category}
                            </span>
                        )}
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">{product.title}</h1>
                        <p className="text-2xl font-bold text-gray-900 mt-4">${product.price}</p>
                        <p className="text-gray-600 mt-4 leading-relaxed text-sm sm:text-base">{product.description}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <button 
                            onClick={handleAddToCart}
                            disabled={adding}
                            className="w-full sm:w-auto cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-xs transition active:scale-[0.98] disabled:opacity-60"
                        >
                            {adding ? "Adding..." : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}