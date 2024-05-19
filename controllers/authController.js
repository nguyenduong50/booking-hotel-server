import User from '../models/User.js';
import { createToken } from '../utils/createToken.js';

export const auth = (req, res) => {
    const body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', async() => {
        const parsedBody = Buffer.concat(body).toString();
        const data = JSON.parse(parsedBody);
        const email = data.email;
        const password = data.password;
        const mode = data.mode;

        //Validate data request
        if(email === '' || !email.includes('@')){
            res.send({message: 'Invalid email'});
            return;
        }

        if(password === ''){
            res.send({message: 'Invalid password'});
            return;
        }

        if(password.length < 8){
            res.send({message: 'Password must be more than 8'});
            return;
        }

        //Find User in database
        const user = await User.findOne({
            email: email,   
            isAdmin: false       
        });

        //LOGIN
        if(mode === 'login'){
            //User not exists
            if(!user){
                res.send({message: 'User not exists'});
                return;
            }
            
            //User exists
            if(user){
                if(user.password !== password){
                    res.send({message: 'Incorrect password'});
                    return;
                }

                const token = createToken(email);
                await user.updateOne({token: token});
                return res.send({token: token, email: user.email});
            }
        }

        //REGISTER
        if(mode === 'register'){
            //User exists
            if(user){
                res.send({message: 'This email has registered an account'});
                return;
            }

            //User not exists
            if(!user){
                //Create new User
                const newUser =  await User.create({
                    email: email,
                    password: password,
                    username: email.substring(email.indexOf('@'), -1)
                }); 
                
                //Send token login to Client
                const token = createToken(email);
                await newUser.updateOne({token: token});
                return res.send({token: token, email: newUser.email});
            }
        }

    });
}

export const logout = (req, res) => {
    const body = [];

    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', async() => {
        const parsedBody = Buffer.concat(body).toString();
        const token = JSON.parse(parsedBody);

        await User.updateOne({token: token}, {token: ''});
        res.send({message: 'logout!'});
    });
}