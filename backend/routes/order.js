import express from 'express';
import { placeOrder, getOrders, getAllOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/place', placeOrder);
router.get('/all',getAllOrder);
router.get('/:userId', getOrders);

export default router;
