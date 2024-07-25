const express = require('express');
const User = require('../../Models/User');
const router = express.Router();

const { validateSignup, encryptPassword } = require('../../Utils/auth');;
const { signJWT, setCookie } = require('../../Utils/auth');


router.post('/', async (req, res) => {
    const user = req.body;

    if (!validateSignup(user)) {
        return res.status(400).json({ status: 'failed', message: 'Invalid data' });
    }

    const encryptedPassword = await encryptPassword(user.password);

    try {
        const newUser = new User({
            name: user.name,
            email: user.email,
            password: encryptedPassword,
            role: user.role
        });
    
        await newUser.save();
    }
    catch (error) {
        return res.status(409).json({ status: 'failed', message: 'Email already exists or Invalid email format' });
    }
    
    const jwt_token = signJWT(user.email);
    setCookie(res, jwt_token);

    return res.status(201).json({ status: 'success' });
});

module.exports = router;