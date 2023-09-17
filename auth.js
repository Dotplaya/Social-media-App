const  mongoose  = require('mongoose');
const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');


//Register 

router.post('/register', async(req, res) => {
     try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
         });

        const user = await newUser.save();
        res.status(201).json({"user created successfully": user});
        
     }catch(err) {
        console.log(err); 
        res.status(500).json({message: err.message});
     }
})

// Login 
router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).json({message: "Invalid credentials"});
        const isPassword = await bcrypt.compare(req.body.password, user.password);
        !isPassword && res.status(400).json('invalid credentials');

        res.status(200).json( user)
    }catch(err) {
        console.log(err);
        res.status(500).json({message: err.message});
    }
})





module.exports = router;