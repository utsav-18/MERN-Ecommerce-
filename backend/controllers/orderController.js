import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/product.js';

// Admins Order Received
export const getAllOrder = async(req,res) => {
    try{
        const orders = await Order.find().sort({createdAt : -1});
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

// Get all orders for a user
export const getOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId })
            .populate('items.productId', 'title image price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error("Get orders error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const placeOrder = async (req,res) => {
    try{
        const {userId, address} = req.body;
        
        //Get cart items for the user
        const cart = await Cart.findOne({userId}).populate('items.productId');

        if(!cart || cart.items.length ===0 ) {
            return res.status(400).json({message: "Cart is Empty"});
        }

        //Prepare Order Items
        const orderItems = cart.items.map(item => ({
            productId : item.productId._id,
            quantity : item.quantity,
            price : item.productId.price,
        }));

        //Total
        const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity),0);

        //Deduct Stock
        for(let item of cart.items){
            await Product.findByIdAndUpdate(item.productId._id, {$inc: {stock: -item.quantity }});
        }

        //Create Order
        const order = await Order.create({
            userId,
            items: orderItems,
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
