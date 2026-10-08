import product from "../models/product.js";

//Create a new Product:
export const createProduct = async(req,res) => {
    try{
        const newProduct = await product.create(req.body);
        res.json({
            message: 'Product created successfully',
            product,
        })
    } catch(err){
        res.status(500).json({message : 'Server Error', err});
    }
};

//Get all product:
export const getProduct = async(req,res) => {
    try{    
        const products = await product.find().sort({createdAt:-1});
        res.json(products);
    } catch(err){
        res.status(500).json({message : 'Server Error', err});
    }
};

//Update a Product 
export const updateProduct = async(req,res)=>{
    try{    
        const updated = await product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new : true}
        );
        res.json({
            message : 'Product updated successfully',
            updated,
        });
    } catch(err){
        res.status(500).json({message : 'Server Error', err});
    }
};

//delete Product
export const deleteProduct = async(req,res) => {
    try{    
        await product.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Product deleted successfully',
        });
    } catch(err){
        res.status(500).json({message : 'Server Error', err});
    }
};