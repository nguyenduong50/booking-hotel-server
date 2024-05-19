import User from '../../models/User.js';
import {pagging} from '../../utils/pagging.js';

export const getUsers = async(req, res) => {
    const users = await User.find({});
    const usersPagging = pagging(users, 10);

    res.send(usersPagging[0]);
};

export const postDeleteUser = async(req, res) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);
        const user_id = data.user_id;
        const errors = {};

        try{
            await User.deleteOne({_id: user_id});
            return res.send({});
        }
        catch(error){
            errors.errorUnknow = 'An unknown error, please check again';
            res.statusCode = 400;
            return res.send(errors);
        }
    });
};