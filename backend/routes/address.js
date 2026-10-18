import express from 'express';
import {saveAddress, getAddressess}  from '../controllers/addressController.js';

const router = express.Router();

router.post('/add', saveAddress);

router.get('/:userId',getAddressess);

export default router;
