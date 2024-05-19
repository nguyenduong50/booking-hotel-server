import mongoose from "mongoose";
const Schema = mongoose.Schema;

const HotelSchema = new Schema(
  {
    name: { 
        type: String, 
        maxLength: 255, 
        unique: true,
        required: true 
    },
    type: { 
        type: String, 
        maxLength: 25,
        required: true  
    },
    city: { 
        type: String, 
        maxLength: 255,
        required: true  
    },
    address: {
        type: String,
        required: true 
    },
    distance: {
        type: Number,
    }, 
    title: {
        type: String
    },
    photos: [],
    desc: {
        type: String
    },
    rating: {
        type: Number,
        default: 5
    },
    featured: {
        type: Boolean,
        default: 0
    },
    rooms: [],
    cheapestPrice: {
        type: Number
    },
    deleted: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
  }
);

const NewHotel = mongoose.model('Hotel', HotelSchema);
export default NewHotel;