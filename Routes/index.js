const express = require('express');
const router = express.Router();
const {isAuthenticated, isAuthorized } = require('../Middlewares/auth');

router.get('/', isAuthenticated, isAuthorized('consumer', 'seller'), (req, res) => {
    if (req.user) {
        res.send(`Hello, ${req.user}`);
    } else {
        res.status(401).send('User not authenticated');
    }
});

module.exports = router;
