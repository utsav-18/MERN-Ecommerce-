import Cart from "../models/Cart.js";


// add to cart's api
export const addCart = async (req,res) => {
    try{

        const {userId, productId} = req.body;
        let cart  = await Cart.findOne({userId});

        if(!cart){
            cart = new Cart({userId,items:[
                {productId, quantity: 1}
            ]});
        }
        else{
            const item = cart.items.find(
                i  => i.productId.toString() == productId
            );
        }
        if(item){
            item.productId += 1;
        }
        else{
            cart.items.push({productId, quantity:1});
        }

        await cart.save();
        res.json({
            message : "Item Added to cart",
            cart
        })

    } catch(err){
        res.status(500).json({message : 'Server Error' , err});
    }
}