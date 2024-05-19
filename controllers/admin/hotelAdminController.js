import mongoose from 'mongoose';
import Hotel from '../../models/Hotel.js';
import Transaction from '../../models/Transaction.js';
import {pagging} from '../../utils/pagging.js';

export const getHotels = async(req, res) => {
    const hotelsTem = await Hotel.find({});
    const hotels = hotelsTem.filter((item) => item.deleted === false);
    const hotelsPagging = pagging(hotels, 8);

    return res.send(hotelsPagging);
}

export const postCreateHotel = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);
        const errors = {};

        //Validate data
        if(data.name === ''){
            errors.nameRequired = 'Field name is required';
        }

        const hotels = await Hotel.find({});
        hotels.forEach(hotel => {
            if(hotel.name === data.name){
                errors.unique = "The hotel name is already taken";
            }
        });

        if(data.type === ''){
            errors.typeRequired = 'Field type is required';
        }

        if(data.city === ''){
            errors.cityRequired = 'Field city is required';
        }

        if(data.address === ''){
            errors.addressRequired = 'Field address is required';
        }

        if(data.distance === ''){
            errors.distanceRequired = 'Field distance is required';
        }

        if(data.title === ''){
            errors.titleRequired = 'Field title is required';
        }

        if(data.desc === ''){
            errors.descriptionRequired = 'Field description is required';
        }

        if(data.cheapestPrice === ''){
            errors.cheapestPriceRequired = 'Field price is required';
        }

        if(data.photos === ''){
            errors.photosRequired = 'Field photos is required';
        }

        if(data.rooms === ''){
            errors.roomsRequired = 'Field rooms is required';
        }

        if(data.name.length > 254){
            errors.nameLength = 'Name must be less than 254 characters';
        }

        if(data.city.length > 254){
            errors.cityLength = 'City must be less than 254 characters';
        }

        if(data.type.length > 20){
            errors.typeLength = 'Length must be less than 20 characters';
        }

        if(Object.keys(errors).length > 0){
            res.statusCode = 400;
            return res.send(errors);
        }

        //Create new Hotel
        const photos = data.photos.split("\n");
        const rooms = data.rooms.map(item => {
            return new mongoose.Types.ObjectId(item);
        })
        
        const newHotel = {
            name: data.name,
            type: data.type,
            city: data.city,
            address: data.address,
            distance: data.distance,
            title: data.title,
            desc: data.desc,
            cheapestPrice: data.cheapestPrice,
            photos: photos,
            featured: data.featured,
            rooms: rooms
        };

        try{
            await Hotel.create(newHotel);
            return res.send({});
        }
        catch(error){
            errors.errorUnknow = 'An unknown error, please check your input again';
            res.statusCode = 400;
            return res.send(errors);
        }

    });
}

export const getEditHotel = async(req, res) => {
    const hotel_id = req.params.hotel_id;
    const hotel = await Hotel.findOne({_id: hotel_id});

    return res.send(hotel);
};

export const postUpdateHotel = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody); 

        const errors = {};

        //Validate data
        if(data.name === ''){
            errors.nameRequired = 'Field name is required';
        }

        if(data.type === ''){
            errors.typeRequired = 'Field type is required';
        }

        if(data.city === ''){
            errors.cityRequired = 'Field city is required';
        }

        if(data.address === ''){
            errors.addressRequired = 'Field address is required';
        }

        if(data.distance === ''){
            errors.distanceRequired = 'Field distance is required';
        }

        if(data.title === ''){
            errors.titleRequired = 'Field title is required';
        }

        if(data.desc === ''){
            errors.descriptionRequired = 'Field description is required';
        }

        if(data.cheapestPrice === ''){
            errors.cheapestPriceRequired = 'Field price is required';
        }

        if(data.photos === ''){
            errors.photosRequired = 'Field photos is required';
        }

        if(data.rooms === ''){
            errors.roomsRequired = 'Field rooms is required';
        }

        if(data.name.length > 254){
            errors.nameLength = 'Name must be less than 254 characters';
        }

        if(data.city.length > 254){
            errors.cityLength = 'City must be less than 254 characters';
        }

        if(data.type.length > 20){
            errors.typeLength = 'Length must be less than 20 characters';
        }

        if(Object.keys(errors).length > 0){
            res.statusCode = 400;
            return res.send(errors);
        }

        //Update Hotel
        const photos = data.photos.split("\n");
        const rooms = data.rooms.map(item => {
            return new mongoose.Types.ObjectId(item);
        })
        const hotel_id = data.hotel_id;

        try{
            await Hotel.updateOne(
                {_id: hotel_id},
                {
                    name: data.name,
                    type: data.type,
                    city: data.city,
                    address: data.address,
                    distance: data.distance,
                    title: data.title,
                    desc: data.desc,
                    cheapestPrice: data.cheapestPrice,
                    photos: photos,
                    featured: data.featured,
                    rooms: rooms
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

export const postDeleteHotel = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);     

        //Validate data
        const errors = {};
        let isBooking = false;
        const nowDate = new Date(Date.now());
        const transactionsHotel = await Transaction.find({hotel: data.hotel_id});
        transactionsHotel.forEach(item => {
            const endDate = new Date(item.dateEnd);
            if(endDate > nowDate){
                isBooking = true;
            }
        });
        if(isBooking){
            errors.booking = "This hotel currently has customers booking rooms, please wait until the end of checkout day";
        }
        if(Object.keys(errors).length > 0){
            res.statusCode = 400;
            return res.send(errors);
        }

        //Delete Hotel
        try{
            await Hotel.updateOne({_id: data.hotel_id}, {deleted: true});
            return res.send({});
        }
        catch(error){
            errors.errorUnknow = 'An unknown error, please check your input again';
            res.statusCode = 400;
            return res.send(errors);
        }
    });
};

export const postDeleteHotels = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);     
        const hotelListChecked = data.hotelList.filter(item => item?.isChecked === true);

        //Validate data
        const errors = {};
        let isBooking = false;
        const nowDate = new Date(Date.now());

        for(let i = 0; i <= hotelListChecked.length - 1; i ++){
            const transactionsHotel = await Transaction.find({hotel: hotelListChecked[i]._id});
            transactionsHotel.forEach(item => {
                const endDate = new Date(item.dateEnd);
                if(endDate > nowDate){
                    isBooking = true;                 
                }
            })
        }

        if(isBooking){
            errors.booking = "One of the hotels is currently booked, please check again";
        }
        if(Object.keys(errors).length > 0){
            res.statusCode = 400;
            return res.send(errors);
        }

        //Delete Hotels
        try{
            data.hotelList.forEach(async(hotel) => {
                if(hotel.isChecked){
                    await Hotel.updateOne({_id: hotel._id}, {deleted: true})
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
}

export const getTrashHotels = async (req, res) => {
    const hotelsTem = await Hotel.find({});
    const hotels = hotelsTem.filter((item) => item.deleted === true);
    const hotelsPagging = pagging(hotels, 10);

    return res.send(hotelsPagging[0]);
};

export const postRestoreHotel = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);     
        const errors = {};

        //Restore Hotel
        try{
            const hotel = await Hotel.updateOne({_id: data.hotel_id}, {deleted: false});
            return res.send({});
        }
        catch(error){
            errors.errorUnknow = 'An unknown error, please check your input again';
            res.statusCode = 400;
            return res.send(errors);
        }
    });
};

export const postRestoreHotels = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);     
 
        const errors = {};

        //Restore Hotels
        try{
            data.hotelList.forEach(async(hotel) => {
                if(hotel.isChecked){
                    await Hotel.updateOne({_id: hotel._id}, {deleted: false})
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

export const postDestroyHotel = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);     
        const errors = {};

        //Destroy Hotel
        try{
            await Hotel.deleteOne({_id: data.hotel_id});
            return res.send({});
        }
        catch(error){
            errors.errorUnknow = 'An unknown error, please check your input again';
            res.statusCode = 400;
            return res.send(errors);
        }
    });
};

export const postDestroyHotels = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);     
        const errors = {};

        //Delete Hotel
        try{
            data.hotelList.forEach(async(hotel) => {
                if(hotel.isChecked){
                    await Hotel.deleteOne({_id: hotel._id})
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
