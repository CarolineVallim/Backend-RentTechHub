const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User.model');

const {isAuthenticated} = require('../middleware/jwt.middleware');

const router = express.Router();

const saltRounds = 10; 

// POST '/auth/signup' - Creates a new user in the database
router.post('/signup', (req,res)=>{
    const {email, password, name} = req.body; 
    /* doing object destructuring is the same as: 
    const email = req.body.email; 
    const password = req.body.password; 
    const name = req.body.name; 
    */

    /*  "What if I don't have all the required fields with information?"  */
    if(email === '' || password === '' || name === ''){
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
    User.findOne({email})
        .then((foundUser)=>{
            if(foundUser){
                res.status(400).json({message: 'User already exists'});
                return;
            }

            /* Encrypt a Password */
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            return User.create({email, password: hashedPassword, name});
        }).then((createdUser)=>{
            const {email, name, _id} = createdUser;

            const user = {email, name, _id};

            res.status(201).json({user});
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({message: 'Internal Server Error'})
        })
});

// POST '/auth/login' - Verifies email and password and returns a JWT
router.post('/login', (req, res)=>{
    const {email, password} = req.body; 

    /* What if email and password were left blank? */
    if(email === '' || password === ''){
        res.status(400).json({message: 'Provide email and password.'}); 
        return;
    }

    User.findOne({email})
        .then((foundUser)=>{
            /* What if the user was not found? */
            if(!foundUser){
                res.status(400).json({message: 'User not found'});
                return; 
            }

            /* What if the password is not correct? */
            const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

            if(passwordCorrect){
                const {_id, email, name} = foundUser; 

                const payload = {_id, email, name};

                const authToken = jwt.sign(
                    payload, process.env.TOKEN_SECRET, {algorithm: 'HS256', expiresIn: '6h'}
                )
                return res.status(200).json({authToken: authToken});
            }
            /* What if the password is not correct? */
            else{
                return res.status(400).json({message: 'Password not found'});
            }
        })
        .catch(()=> res.status(500).json({message: 'User not found.'}))
}); 

// GET '/auth/verify' - Used to verify JWT 
router.get('/verify', isAuthenticated, (req,res)=>{
    res.status(200).json(req.payload);
})



module.exports = router; 