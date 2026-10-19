import express from 'express';
import{
    addToCart,
    removeItem,
    updateQuantity,
    getCart,
    clearCart,
} from '../controllers/CartController.js';

const router = express.Router();

router.post('/add',addToCart);

router.post('/remove',removeItem);

router.post('/update',updateQuantity);

router.post('/clear', clearCart);

router.get('/:userId', getCart);

export default router;

