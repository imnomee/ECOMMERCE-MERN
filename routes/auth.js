const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

//REGISTER
router.post('/register', async (req, res) => {
    //create user from the body
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        //ENCRYPT PASSWORD BEFORE SAVING
        //   password: req.body.password,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    });

    //save user to database
    //its a promise so we need async await
    try {
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username,
        });
        //first check if the user exists
        if (!user)
            return res.status(401).json('postLogin: Invalid Credentials');

        //if the user exists
        //decrypt the password we received from db so we can compare with the user provided password
        const dbPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        ).toString(CryptoJS.enc.Utf8);

        //compare the passwords
        if (dbPassword !== req.body.password)
            return res.status(401).json('Invalid Credentials');

        //we need to filter out the password before sending response back to user
        const { password, ...others } = user._doc;

        //create and send a token for the current user
        // we are adding user id and isAdmin in the token for later use and verification
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            {
                expiresIn: '1d',
            }
        );
        //   console.log({ ...others, accessToken });

        return res.status(200).json({ ...others, accessToken });
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
