import User from '../models/user';
import jsonwebtoken from 'jsonwebtoken';
require("dotenv").config();

export const register = async (req, res) => {
    console.log(req.body);
    const {name, email, password} = req.body;
    if (!name) return res.status(400).send('Name is required');
    if (!password || password.length < 6) return res.status(400).send('Password is required and should be min 6 characters');
    let userExist = await User.findOne({email: email}).exec()
    if (userExist) return res.status(400).send('Email is already registered.');
    const user = new User(req.body);
    try {
        await user.save();
        console.log("User saved.");
        return res.json({ok: true});
    } catch(err) {
        console.log('Create user failed.');
        return res.status(400).send('Error: User creation failed');
    }
}

export const login = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email) return res.status(400).send('Email is required');
    if (!password || password.length < 6) return res.status(400).send('Password is required and should be min 6 characters');
    try {
        let user = await User.findOne({email}).exec();
        if (!user) res.status(400).send("User with that email not found.");
        console.log("User Exists", user);
        console.log("Login successful.");
        user.comparePassword(password, (err, match) => {
            console.log("COMPARE PASSWORD IN LOGIN ERROR", err);
            if (!match || err) {
                return res.status(400).send("Wrong password");
            }
            console.log("GENERATE A TOKEN THEN SEND AS RESPONSE TO CLIENT");
            let token = jsonwebtoken.sign({_id: user._id}, process.env.JWT_SECRET, {
                expiresIn: '7d'
            });
            res.json({token, user: {
                name: user.name,
                email: user.email,
                _id: user._id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }});
        })
        
    } catch(err) {
        console.log('Login user failed.');
        return res.status(400).send('Error: User login failed');
    }
}
