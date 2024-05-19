import express from 'express';
import cors from 'cors';
import Router from './routes/index.js';
import mongoose from 'mongoose';
import User from './models/User.js';

const app = express();
const URI = "mongodb+srv://duongnnfx21064:duongnnfx21064@cluster0.wfkgzvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

Router(app);

mongoose.connect(
    URI, 
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then(() => {
    User.findOne().then(user => {
        if (!user) {
            const user1 = new User({
                username: 'Nguyen Duong',
                password: '123456789',
                email: 'duongnnfx21064@funix.edu.vn',
                isAdmin: true
            });
            user1.save();
            const user2 = new User({
                username: 'nguyenduong',
                password: '123456789',
                email: 'nguyenduong@gmail.com',
                isAdmin: false
            });
            user2.save();
        }
    });

    app.listen(5000);
})
.catch(error => {
    console.log(error);
})

