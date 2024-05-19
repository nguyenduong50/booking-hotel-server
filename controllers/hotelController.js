import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Transaction from '../models/Transaction.js';

import {pagging} from '../utils/pagging.js';
import { groupBy } from '../utils/groupBy.js';

export const getBestHotels = async(req, res) => {
    const hotels = await Hotel.find({});
    hotels.sort((a, b) => {
        return b.rating - a.rating;
    });
    const bestHotels = pagging(hotels, 3);
    res.send(bestHotels[0]);
};

export const getHotels = async(req, res) => {
    const hotels = await Hotel.find({});
    res.send(hotels);
};

export const getHotelsByCity = async(req, res) => {
    const data = await Hotel.find({});
    const hotels = groupBy(data, 'city');

    res.send(hotels);
};

export const getHotel = async(req, res) => {
    const hotel_id = req.params.id;
    const rooms = [];

    //Get Hotel
    const hotel = await Hotel.findOne({_id: hotel_id});
    const roomsIdList = hotel.rooms;

    for(let i = 0; i <= roomsIdList.length - 1; i++){
        const room = await Room.findOne({_id: roomsIdList[i]});
        rooms.push(room);
    }

    res.send({hotel, rooms});
};

export const postSearch = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);  
        const destination = data.searchInfo.destination;
        const startDate = new Date(data.searchInfo.date[0].startDate);
        const endDate = new Date(data.searchInfo.date[0].endDate);
        const quantityAdult = Number(data.searchInfo.options.adult);
        const quantityChildren = Number(data.searchInfo.options.children);
        const quantityRoom = Number(data.searchInfo.options.room);
        
        let transactions = await Transaction.find({});
        const hotels = await Hotel.find({}); 

        //Add total room into element list hotel
        let hotelSearch = hotels.map(hotel => {
            return{
                ...hotel._doc,
                emptyRoom: 0,
                totalRoom: 0
            }
        }); 
      
        //Filter hotel by destination
        if(destination !== ''){
            hotelSearch = hotelSearch.filter(hotel => {
                return hotel.city.toLowerCase().includes(destination.toLowerCase()) || 
                    hotel.address.toLowerCase().includes(destination.toLowerCase());
            });
        }

        //Add room object into list hotel
        for(let i = 0; i <= hotelSearch.length - 1; i++){
            for(let j = 0; j <= hotelSearch[i].rooms.length - 1; j++){
                const room = await Room.findOne({_id: hotelSearch[i].rooms[j]});
                hotelSearch[i].rooms[j] = room;
            }
        }

        //Calculate quantity empty room each hotel
        for(let i = 0; i <= hotelSearch.length - 1; i++){
            const totalRoom = hotelSearch[i].rooms.reduce((total, room) => {
                return total + room.roomNumbers.length;
            }, 0);
            hotelSearch[i].emptyRoom = totalRoom;
            hotelSearch[i].totalRoom = totalRoom;
        }

        transactions = transactions.filter(transaction => {
            return (startDate >= transaction.dateStart && startDate <= transaction.dateEnd) ||
                (endDate >= transaction.dateStart && endDate <= transaction.dateEnd);
        });

        for(let i = 0; i <= hotelSearch.length - 1; i++){
            for(let j = 0; j <= transactions.length - 1; j++){
                if(hotelSearch[i]._id.toString() === transactions[j].hotel.toString()){
                    hotelSearch[i].emptyRoom = hotelSearch[i].totalRoom - transactions[j].room.length;
                }
            }
        }

        hotelSearch = hotelSearch.filter(hotel => {
            return hotel.emptyRoom >= quantityRoom;
        });       

        //Filter quantity customer - 1 adult is accompanied by 1 child
        let hotelResult = [];
        let quantityCustomer = 0;
        if(quantityRoom === 1){
            if(quantityChildren <= quantityAdult){
                quantityCustomer = quantityAdult;
                hotelSearch.forEach(hotel => {
                    let isQuantity = false;
                    hotel.rooms.forEach(room => {
                        if(room.maxPeople >= quantityCustomer){                           
                            isQuantity = true;
                        }
                    });
                    if(isQuantity){
                        hotelResult.push(hotel);
                    }
                })
            }
    
            if(quantityChildren > quantityAdult){
                quantityCustomer = quantityAdult + (quantityChildren - quantityAdult);
                hotelSearch.forEach(hotel => {
                    let isQuantity = false;
                    hotel.rooms.forEach(room => {
                        if(room.maxPeople >= quantityCustomer){
                            isQuantity = true;
                        }
                    });
                    if(isQuantity){
                        hotelResult.push(hotel);
                    }
                })
            }
        }

        return res.send(hotelResult);
    });
};
