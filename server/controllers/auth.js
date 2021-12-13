import User from '../models/user'

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
