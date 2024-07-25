require('dotenv').config();

const express = require('express');
const User = require('../../Models/User');
const router = express.Router();
const { validateLogin } = require('../../Utils/auth');
const jwt = require('jsonwebtoken');
const { signJWT, setCookie } = require('../../Utils/auth');


router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 'failed', message: 'Email and password are required' });
    }

    
    if (await validateLogin({ email, password })) {
        const jwt_token = signJWT(email);
        setCookie(res, jwt_token);

        return res.json({ status: 'success' });
    }

    return res.status(401).json({ status: 'failed', message: 'Incorrect login details' });
});

module.exports = router;
