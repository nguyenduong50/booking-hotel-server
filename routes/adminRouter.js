import express from 'express';
import { getHomeAdmin } from '../controllers/admin/homeAdminController.js';
import {getUsers, postDeleteUser} from '../controllers/admin/userAdminController.js';
import {
    getHotels, 
    postCreateHotel,
    getEditHotel, 
    postUpdateHotel,
    postDeleteHotel, 
    getTrashHotels, 
    postDeleteHotels, 
    postRestoreHotel, 
    postRestoreHotels,
    postDestroyHotel,
    postDestroyHotels
} from '../controllers/admin/hotelAdminController.js';

import {
    getRooms, 
    getAllRooms, 
    postCreateRoom,
    getEditRoom,
    postUpdateRoom,
    postDestroyRoom,
    postDestroyRooms
} from '../controllers/admin/roomAdminController.js';

import {getTransactions} from '../controllers/admin/transactionAdminController.js';

const adminRouter = express.Router();

//Admin Home
adminRouter.get('/home-admin', getHomeAdmin);

//Admin User
adminRouter.get('/users', getUsers);
adminRouter.post('/delete-user', postDeleteUser);

//Admin Hotel
adminRouter.get('/hotels', getHotels);
adminRouter.post('/create-hotel', postCreateHotel);
adminRouter.get('/edit-hotel/:hotel_id', getEditHotel);
adminRouter.post('/update-hotel', postUpdateHotel);
adminRouter.post('/delete-hotel', postDeleteHotel);
adminRouter.post('/delete-hotels', postDeleteHotels);
adminRouter.get('/trash-hotels', getTrashHotels);
adminRouter.post('/restore-hotel', postRestoreHotel);
adminRouter.post('/restore-hotels', postRestoreHotels);
adminRouter.post('/destroy-hotel', postDestroyHotel);
adminRouter.post('/destroy-hotels', postDestroyHotels);

//Admin Room
adminRouter.get('/rooms', getRooms);
adminRouter.get('/all-rooms', getAllRooms);
adminRouter.post('/create-room', postCreateRoom);
adminRouter.get('/edit-room/:room_id', getEditRoom);
adminRouter.post('/update-room', postUpdateRoom);
adminRouter.post('/destroy-room', postDestroyRoom);
adminRouter.post('/destroy-rooms', postDestroyRooms);

//Admin Transaction
adminRouter.get('/transactions', getTransactions);

export default adminRouter;