import { useEffect, useState } from "react";    
import api from "../api/axios";
import {useNavigate, useParams} from "react-router";

export default function EditProduct(){
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title:  "",
        description : "",
        price : "",
        category : "",
        image : "",
        stock : "",
    });

    const allowedField = ["title","description","price","category","image","stock"];

    const loadProduct = async () => {
        const res = await api.get(`/products`);
        const product = res.data.find((p) => p.id == parseInt(id));
        setForm(product);
    }

    useEffect(()=>{
        loadProduct();
    },[]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.put(`/product/edit/${id}`,form);
        alert("Product updated successfully!");
        navigate("/admin/products");
    }

    return(
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded">
            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                {
                            allowedField.keys(form).map((key) =>(
                                <input
                                    key = {key}
                                    name = {key}
                                    value = {form[key]}
                                    onChange={handleChange}
                                    placeholder={key}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            ))
                }
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            Add Product
                        </button>
            </form>
        </div>
    )
  
}