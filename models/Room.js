import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
  {
    title: { 
        type: String, 
        maxLength: 255, 
        unique: true,
        required: true 
    },
    price: { 
        type: Number, 
        required: true  
    },
    maxPeople: { 
        type: Number, 
        required: true 
    },
    desc: {
        type: String
    },
    roomNumbers: {
        type: Array,
        required: true 
    }, 
  },
  {
    timestamps: true,
  }
);

const NewRoom = mongoose.model('Room', RoomSchema);
export default NewRoom;