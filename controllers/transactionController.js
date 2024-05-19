import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

import { getTimeDays } from '../utils/getDays.js';

export const getTransactionByUser = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody); 

        const user = await User.findOne({token: data.token});
        const user_id = user._id;
        
        const transactionList = await Transaction.find({user: user_id}).populate('hotel');
        return res.send(transactionList);
    });
};

export const postBooking = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);     
        
        const user = await User.findOne({email: data.email});
        const roomNumbers = data.roomNumbers.filter(item => item.isChecked === true);
        const startDate = new Date(data.date[0].startDate);
        const endDate = new Date(data.date[0].endDate);
        const roomList = roomNumbers.map(roomNumber => {
            return roomNumber.roomNumber;
        });
        const timeDays = getTimeDays(startDate, endDate);

        //Validate request data
        let errorTempo = {};
        if(data.fullName === ''){
            errorTempo.fullName = "Fullname missing";
        }
        if(data.email === ''){
            errorTempo.email = "Email missing";
        }
        if(data.phoneNumber === ''){
            errorTempo.phoneNumber = "PhoneNumber missing";
        }
        if(data.idCardNumber === ''){
            errorTempo.idCardNumber = "Id Card Number missing";
        }

        // if(data.date[0].endDate <= data.date[0].startDate){
        //     errorTempo.date = "The booking end-date must be after the start-date";
        // }

        if(data.paymentMethod === ''){
            errorTempo.paymentMethod = "Payment method missing";
        }

        if(!user){
            errorTempo.user = "Not found user by email";
        }

        if(roomNumbers.length === 0){
            errorTempo.roomNumbers = "No rooms have been selected yet";
        }

        //Check date booked
        let transactions = await Transaction.find({});
        transactions = transactions.filter(transaction => transaction.hotel.toString() === data.hotel_id.toString());
        transactions = transactions.filter(transaction => {
            return (startDate >= transaction.dateStart && startDate <= transaction.dateEnd) ||
                (endDate >= transaction.dateStart && endDate <= transaction.dateEnd);
        });

        let isRoomBooked = false;      
        transactions.forEach(transaction => {
            roomList.forEach(room => {
                if(transaction.room.includes(room)){
                    isRoomBooked = true;
                }
            })
        })
        if(transactions.length > 0 && isRoomBooked){
            errorTempo.dataBooking = "Please choose another date and onother room, the room you booked is the same date as another customer"
        }

        if(Object.keys(errorTempo).length > 0){
            res.statusCode = 400;
            return res.send(errorTempo);
        }

        //Process price booked room

        const totalPriceOneDay = roomNumbers.reduce((total, item) => {
            return total + item.price
        }, 0); 
        const totalPrice = totalPriceOneDay * timeDays;

        //Add new Transaction
        const newTransaction = {
            user: user._id,
            hotel: data.hotel_id,
            room: roomList,
            dateStart: startDate,
            dateEnd: endDate,
            price: totalPrice,
            payment: data.paymentMethod,
        };

        await Transaction.create(newTransaction);

        res.send({});
    });
};