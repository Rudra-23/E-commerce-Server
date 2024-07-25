require('dotenv').config();

const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const Consumer = require('../Models/Consumer');
const Seller = require('../Models/Seller');

async function isAuthenticated(req, res, next) {
  try {
      const token = req.cookies?.token_id || null;

      if (!token) {
          return res.json({ status: 'failed', message: 'Not authenticated' });
      }

      try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          const user = await User.findOne({ email: decoded.email });

          if (!user) {
              return res.json({ status: 'failed', message: 'Not authenticated' });
          }

          req.user = user;
          next();
      } catch (err) {
          if (err.name === 'TokenExpiredError') {
              return res.json({ status: 'failed', message: 'Jwt token expired' });
          } else {
              return res.json({ status: 'failed', message: 'Jwt token invalid' });
          }
      }
  } catch (err) {
      console.error('Authentication error:', err);
      return res.json({ status: 'failed', message: 'Internal server error' });
  }
}


async function getConsumer(user) {
  try {
      let consumer = await Consumer.findOne({ user_id: user._id });

      if (!consumer) {
          consumer = new Consumer({ user_id: user._id });
          await consumer.save();
      }

      return consumer;
  } catch (err) {
      console.error('Error fetching or creating consumer:', err);
      throw new Error('Unable to get or create consumer');
  }
}

async function getSeller(user) {
  try {
      let seller = await Seller.findOne({ user_id: user._id });

      if (!seller) {
          seller = new Seller({ user_id: user._id });
          await seller.save();
      }

      return seller;
  } catch (err) {
      console.error('Error fetching or creating seller:', err);
      throw new Error('Unable to get or create seller');
  }
}


function isAuthorized(...roles) {
  return async (req, res, next) => {
      try {
          if (!roles.includes(req.user.role)) {
              return res.status(403).json({ message: "Access forbidden: insufficient rights" });
          }

          if (req.user.role === 'consumer') {
              req.user = await getConsumer(req.user);
          } else if (req.user.role === 'seller') {
              req.user = await getSeller(req.user);
          }
          next();
      } catch (err) {
          console.error('Authorization error:', err);
          return res.status(500).json({ message: "Internal server error" });
      }
  };
}

module.exports = {isAuthenticated, isAuthorized};
