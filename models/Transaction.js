import { ObjectId } from "bson";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true  
    },
    hotel: { 
        type: Schema.Types.ObjectId, 
        ref: 'Hotel',
        required: true  
    },
    room: { 
        type: Array, 
        required: true 
    },
    dateStart: {
        type: Date,
        required: true 
    },
    dateEnd: {
        type: Date,
        required: true 
    }, 
    price: {
        type: Number,
        required: true 
    }, 
    payment: {
        type: String,
        required: true 
    }, 
    status: {
        type: String,
        required: true,
        default: 'Booked' 
    }, 
  },
  {
    timestamps: true,
  }
);

const NewTransaction = mongoose.model('Transaction', TransactionSchema);
export default NewTransaction;