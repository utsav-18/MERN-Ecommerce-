import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/product.js';

export const placeOrder = async (req,res) => {
    try{
        const {userId, address} = req.body;
        
        //Get cart items for the user
        const cart = await Cart.findOne({userId}).populate('items.productId');

        if(!cart || cart.items.length ===0 ) {
            return res.status(400).json({message: "Cart is Empty"});
        }

        //Prepare Oder Item
        const oderItems = cart.items.map(item => ({
            productId : item.productId._id,
            quantity : item.quantity,
            price : item.productId.price,
        }));

        //Total
        const totalAmount = oderItems.reduce((total, item) => total + (item.price * item.quantity),0);

        //Deduct Stock
        for(let item of cart.items){
            await Product.findByIdAndUpdate(item.productId._id, {$inc: {stock: -item.quantity }});
        }

        //Create Order
        const order = await Order.create({
            userId,
            items: oderItems,
            address,
            totalAmount,
            paymentMethod: "COD",
        });

        //clear cart
        await Cart.findOneAndUpdate({userId}, {items: []});

        res.status(201).json({message: "Order Placed Successfully", orderId : order._id});

    }catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Internal server error" });
    }
}