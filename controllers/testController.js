import Transaction from '../models/Transaction.js';
import Room from '../models/Room.js';

export const getTest = async(req, res) => {
    const roomNumberRequest = [209, 220, 301];
    const rooms = await Room.find({});
    const roomNumbers = [];
    
    rooms.forEach(room => {
        room.roomNumbers.forEach(roomNumber => {
            roomNumbers.push(roomNumber);
        });
    });

    let isExisted = false;
    roomNumberRequest.forEach(roomNumberRequest => {
        roomNumbers.forEach(roomNumber => {
            if(roomNumberRequest === roomNumber){
                isExisted = true;
            }
        });
    });

    return res.send({isExisted});
};