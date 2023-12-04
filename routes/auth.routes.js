const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User.model');
const Cart = require('../models/Cart.model')

const {isAuthenticated} = require('../middleware/jwt.middleware');

const router = express.Router();

const saltRounds = 10;

// POST '/auth/signup' - Creates a new user in the database
router.post('/signup', async (req,res)=>{
    const {email, password, firstName, lastName, imageProfile, address, type} = req.body; 

    /*  "What if I don't have all the required fields with information?"  */
    if(email === '' || password === '' || firstName === '' || lastName === '' || address === '' || type === ''){
        res.status(400).json({message: "Provide email, password and name."})
        return; // -> return will stop the code. 
    }

    /* "What if I have an e-mail, but it's not a real e-mail? E.g.: user.com" */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if(!emailRegex.test(email)){
        res.status(400).json({message: 'Provide a valid e-mail.'})
        return; 
    }

    /* "What if I want password validation? In order to avoid pass like: "123" */
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!passwordRegex.test(password)){
        res.status(400).json({message: 'Password must have at least 6 characters and contain 1 lowercase letter, 1 uppercase letter, 1 number'}); 
        return; 
    }

    /* "What if a user already exists?" */
    const foundUser = await User.findOne({email})
    if(foundUser){
        res.status(400).json({message: 'User already exists'});
        return;
    }

    /* Encrypt a Password */
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({email, password: hashedPassword, firstName, lastName, imageProfile, address, type});
    const {_id} = createdUser;

    const user = {email, firstName, lastName, _id, imageProfile, address, type};

    await Cart.create({user: _id})

    res.status(201).json({user});
});

// POST '/auth/login' - Verifies email and password and returns a JWT
router.post('/login', (req, res)=>{
    const {email, password} = req.body; 

    if(email === '' || password === ''){
        res.status(400).json({message: 'Provide email and password.'}); 
        return;
    }

    User.findOne({email})
        .then((foundUser)=>{
            if(!foundUser){
                res.status(400).json({message: 'User not found'});
                return; 
            }

            /* What if the password is not correct? */
            const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

            if(passwordCorrect){
                const {_id, email, firstName, lastName, imageProfile, address, type} = foundUser; 

                const payload = {_id, email, firstName, lastName, imageProfile, address, type};

                const authToken = jwt.sign(
                    payload, process.env.TOKEN_SECRET, {algorithm: 'HS256', expiresIn: '6h'}
                )
                return res.status(200).json({authToken: authToken, type});
            }
            else{
                return res.status(400).json({message: 'Password not found'});
            }
        })
}); 
//
// GET '/auth/verify' - Used to verify JWT 
router.get('/verify', isAuthenticated, (req,res)=>{
    res.status(200).json(req.payload);
})

// PUT '/auth/update' - Updates user information
router.put('/update/:userId', isAuthenticated, async (req, res) => {
    const userId = req.payload._id;
    const { firstName, lastName, password, email, address, imageProfile } = req.body;

    // Validate incoming data
    if (!firstName && !password && !email) {
        return res.status(400).json({ message: 'Provide at least one field to update' });
    }

    const foundUser = await User.findById(userId);
    if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
    } else {
        // Update user fields if provided
        if (firstName) {
            foundUser.firstName = firstName;
        }
        if (password) {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            foundUser.password = hashedPassword;
        }
        if (email) {
            foundUser.email = email;
        }
        if (address) {
            foundUser.address = address;
        }
        if (imageProfile) {
            foundUser.imageProfile = imageProfile;
        }

        const updatedUser = await foundUser.save();
        const { _id, email: updatedEmail, firstName: updatedName, address: updatedAddress, imageProfile: updatedImageProfile } = updatedUser;
        const updatedUserData = { _id, email: updatedEmail, firstName: updatedName, address: updatedAddress, imageProfile: updatedImageProfile };
        res.status(200).json({ user: updatedUserData, message: 'User updated successfully' });
    }
});


module.exports = router; 