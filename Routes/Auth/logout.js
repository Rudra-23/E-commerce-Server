const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../../Middlewares/auth');

const { clearCookie } = require('../../Utils/auth');

router.post('/', isAuthenticated, async (req, res) => {
    const token = req.cookies ? req.cookies.token_id : null;

    if (token) {
        clearCookie(res);
    }

    return res.json({ status: 'success' });
});

module.exports = router;
