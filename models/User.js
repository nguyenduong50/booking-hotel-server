import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { 
        type: String, 
        maxLength: 255, 
    },
    password: { 
        type: String, 
        maxLength: 255, 
        minLength: 8,
        required: true  
    },
    fullName: { 
        type: String, 
        maxLength: 255 
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }, 
    isAdmin: {
        type: Boolean,
        default: false
    },
    token: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

const NewUser = mongoose.model('User', UserSchema);
export default NewUser;