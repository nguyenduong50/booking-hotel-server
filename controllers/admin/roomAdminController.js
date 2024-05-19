import Room from '../../models/Room.js';
import Transaction from '../../models/Transaction.js';
import {pagging} from '../../utils/pagging.js';

export const getRooms = async(req, res) => {
    const rooms = await Room.find({});
    const roomsPagging = pagging(rooms, 8);

    return res.send(roomsPagging);
}; 

export const getAllRooms = async(req, res) => {
    const rooms = await Room.find({});
    return res.send(rooms);
};

export const postCreateRoom = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);
        const errors = {};
        
        //Validate data
        if(data.title === ''){
            errors.title = "Title must required";
        }

        if(data.price === ''){
            errors.price = "Price must required";
        }

        if(data.desc === ''){
            errors.desc = "Description must required";
        }

        if(data.maxPeople === ''){
            errors.maxPeople = "Max People must required";
        }

        if(data.roomNumbers === ''){
            errors.roomNumbers = "RoomNumbers must required";
        }

        //Process room-number
        const roomNumbersRequest = data.roomNumbers.split(",");
        roomNumbersRequest.forEach((item, index) => {
            roomNumbersRequest[index] = Number(item.trim());
        });

        const rooms = await Room.find({});
        const roomNumbers = [];
        
        rooms.forEach(room => {
            room.roomNumbers.forEach(roomNumber => {
                roomNumbers.push(roomNumber);
            });
        });

        let isExisted = false;
        roomNumbersRequest.forEach(roomNumberRequest => {
            roomNumbers.forEach(roomNumber => {
                if(roomNumberRequest === roomNumber){
                    isExisted = true;
                }
            });
        });

        if(isExisted){
            errors.roomNumberExisted = "The room number is already in use, please enter another room number";
        }

        //Senb Errors to Client
        if(Object.keys(errors).length > 0){
            res.statusCode = 400;
            return res.send(errors);
        }

        //Create new Room
        try{
            const newRoom = {
                title: data.title,
                price: Number(data.price),
                desc: data.desc,
                maxPeople: Number(data.maxPeople),
                roomNumbers: roomNumbersRequest
            };
    
            await Room.create(newRoom);
            return res.send({});
        }
        catch(error){
            errors.errorUnknow = 'An unknown error, please check your input again';
            res.statusCode = 400;
            return res.send(errors);
        }
    });
};

export const getEditRoom = async(req, res) => {
    const room_id = req.params.room_id;
    const room = await Room.findOne({_id: room_id});

    return res.send(room);
};

export const postUpdateRoom = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);
        const errors = {};
        
        //Validate data
        if(data.title === ''){
            errors.title = "Title must required";
        }

        if(data.price === ''){
            errors.price = "Price must required";
        }

        if(data.desc === ''){
            errors.desc = "Description must required";
        }

        if(data.maxPeople === ''){
            errors.maxPeople = "Max People must required";
        }

        if(data.roomNumbers === ''){
            errors.roomNumbers = "RoomNumbers must required";
        }

        //Process room-number
        const roomNumbersRequest = data.roomNumbers.split(",");
        roomNumbersRequest.forEach((item, index) => {
            roomNumbersRequest[index] = Number(item.trim());
        });

        const rooms = await Room.find({});
        const roomNumbers = [];
        
        rooms.forEach(room => {
            room.roomNumbers.forEach(roomNumber => {
                roomNumbers.push(roomNumber);
            });
        });

        //Remove roomNumber by Room in roomNumbers
        const room = await Room.findOne({_id: data.room_id});
        const roomNumberList = room.roomNumbers;

        for(let i = 0; i <= roomNumbers.length - 1; i++){
            roomNumberList.forEach(roomNumber => {
                if(roomNumbers[i] === roomNumber){
                    roomNumbers.splice(i, 1);
                }
            });
        }

        //Check roomNumberRequest existed roomNumber
        let isExisted = false;
        roomNumbersRequest.forEach(roomNumberRequest => {
            roomNumbers.forEach(roomNumber => {
                if(roomNumberRequest === roomNumber){
                    isExisted = true;
                }
            });
        });

        if(isExisted){
            errors.roomNumberExisted = "The room number is already in use, please enter another room number";
        }

        //Senb Errors to Client
        if(Object.keys(errors).length > 0){
            res.statusCode = 400;
            return res.send(errors);
        }

        //Update new Room
        try{
            await Room.updateOne(
                {_id: data.room_id},
                {
                    title: data.title,
                    price: Number(data.price),
                    desc: data.desc,
                    maxPeople: Number(data.maxPeople),
                    roomNumbers: roomNumbersRequest 
                }
            );
    
            return res.send({});
        }
        catch(error){
            errors.errorUnknow = 'An unknown error, please check your input again';
            res.statusCode = 400;
            return res.send(errors);
        }
    });
};

export const postDestroyRoom = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);     
        const roomId = data.room_id;
        const room = await Room.findOne({_id: roomId});
        const roomNumbers = room.roomNumbers;
 
        //Validate data
        const errors = {};
        let isBooking = false;
        const nowDate = new Date(Date.now());
        const transactions = await Transaction.find({});
        const transactionsBooking = transactions.filter(item => item.dateEnd > nowDate);

        transactionsBooking.forEach(transaction => {
            roomNumbers.forEach(roomNumber => {
                if(transaction.room.includes(roomNumber)){
                    isBooking = true;
                }
            });
        });

        if(isBooking){
            errors.booking = "This room currently has customers booking rooms, please wait until the end of checkout day";
        }
        if(Object.keys(errors).length > 0){
            res.statusCode = 400;
            return res.send(errors);
        }

        //Destroy Room
        try{
            await Room.deleteOne({_id: roomId});
            return res.send({});
        }
        catch(error){
            errors.errorUnknow = 'An unknown error, please check your input again';
            res.statusCode = 400;
            return res.send(errors);
        }
    });
};

export const postDestroyRooms = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);  
        const roomChecked = data.roomList.filter(item => item?.isChecked === true);   
        const roomNumbers = [];

        roomChecked.forEach(room => {
            roomNumbers.push(...room.roomNumbers);
        });
 
        //Validate data
        const errors = {};
        let isBooking = false;
        const nowDate = new Date(Date.now());
        const transactions = await Transaction.find({});
        const transactionsBooking = transactions.filter(item => item.dateEnd > nowDate);
        const roomNumberTransactions = [];
        transactionsBooking.forEach(transaction => {
            roomNumberTransactions.push(...transaction.room);
        });
        
        roomNumbers.forEach(roomNumber => {
            if(roomNumberTransactions.includes(roomNumber)){
                isBooking = true;
            }
        });
        
        if(isBooking){
            errors.booking = "One of the rooms is currently booked, please check again";
        }
        if(Object.keys(errors).length > 0){
            res.statusCode = 400;
            return res.send(errors);
        }

        //Delete Hotel
        try{
            data.roomList.forEach(async(room) => {
                if(room.isChecked){
                    await Room.deleteOne({_id: room._id})
                }
            });
            return res.send({});
        }
        catch(error){
            errors.errorUnknow = 'An unknown error, please check your input again';
            res.statusCode = 400;
            return res.send(errors);
        }
    });
};
