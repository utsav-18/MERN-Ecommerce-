import { useEffect, useState } from "react";
import api from "../api/axios";
import {Link} from "react-router";


export default function Home() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const loadProducts = async () => {
        const res = await api.get(`/products?search=${search}&category=${category}`);
        setProducts(res.data);
    }

    useEffect(()=>{
        loadProducts();
    }, [search, category]);


    return (
        <div className="p-6">

            {/*Search*/}
            <div className="mb-4 flex gap-3">

                <input placeholder="Search Products.." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded w-1/2"
                />
                
                {/*Category */}

                <select value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border px-3 py-2 rounded"
                >
                    <option value="">All Categories</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Mobiles">Mobiles</option>
                    <option value="Tablets">Tablets</option>
                </select>
                

            </div>

        </div>
    );
}