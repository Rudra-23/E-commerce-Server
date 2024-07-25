const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/User');

const saltRounds = 10;
function signJWT(email) {
    try {
        if (!process.env.SECRET_KEY) {
            throw new Error('SECRET_KEY is not defined');
        }

        const jwt_token = jwt.sign(
            { email },
            process.env.SECRET_KEY,
            { expiresIn: '30m' }
        );
        
        return jwt_token;
    } catch (error) {
        console.error('Error signing JWT:', error);
        throw error;
    }
}

function setCookie(res, token_id) {
    try {
        res.cookie('token_id', token_id, {
            httpOnly: true, // this prevents JavaScript access
            secure: process.env.NODE_ENV === 'production', // only use HTTPS in production
            sameSite: 'strict', // this prevents CSRF attacks
            maxAge: 30 * 60 * 1000 // for 30 minutes
        });
    } catch (error) {
        console.error('Error setting cookie:', error);
    }
}
function clearCookie(res) {
    try {
        res.cookie('token_id', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0) // to expire immediately
        });
    } catch (error) {
        console.error('Error clearing cookie:', error);
    }
}


async function validateLogin(user) {
    try {
        const storedUser = await User.findOne({ email: user.email });

        if (!storedUser) {
            return false;
        }

        const isMatch = await bcrypt.compare(user.password, storedUser.password);
        return isMatch;

    } catch (error) {
        console.error('Error validating login credentials:', error);
        throw new Error('Error validating login credentials');
    }
}

function validateSignup(user) {
    if (!user || typeof user !== 'object') {
        return false;
    }

    const { name, email, password } = user;

    if (!name || !email || !password) {
        return false;
    }

    if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
        return false;
    }

    if (password.length < 6) {
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    return true;
}

async function encryptPassword(password) {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error('Error encrypting password:', error);
        throw new Error('Failed to encrypt password');
    }
}

module.exports = { signJWT, setCookie, clearCookie, validateLogin, validateSignup, encryptPassword };