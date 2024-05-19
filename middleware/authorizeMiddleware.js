import User from '../models/User.js';

export const authorizeMiddleware = async(req, res, next) => {
    const token = req.query.token;

    if(!token){
        res.statusCode = 401;
        return res.send({message: "Unauthorized"}); 
    }

    let isAuthorized = false;
    const users = await User.find({});

    users.forEach(user => {
        if(user.token === token){
            isAuthorized = true;
        }
    });

    if(!isAuthorized){
        res.statusCode = 401;
        return res.send({message: "Unauthorized"});
    }
       
    next(); 
}