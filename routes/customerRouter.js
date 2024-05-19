import express from 'express';
import {getBestHotels, getHotelsByCity, getHotels, getHotel, postSearch} from '../controllers/hotelController.js';
import {postBooking, getTransactionByUser} from '../controllers/transactionController.js';
import { authorizeMiddleware } from '../middleware/authorizeMiddleware.js';

const customerRouter = express.Router();

customerRouter.get('/best-hotels', getBestHotels);
customerRouter.get('/hotels-by-city', getHotelsByCity);
customerRouter.get('/hotels', getHotels);
customerRouter.get('/hotel/:id', getHotel);
customerRouter.post('/search', postSearch);
customerRouter.post('/booking', authorizeMiddleware, postBooking);
customerRouter.post('/get-transaction-by-user', getTransactionByUser);

export default customerRouter;
