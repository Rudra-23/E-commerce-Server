require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectToMongoDB = require('./Connections/mongodb');

// Import Routes
const indexRouter = require('./Routes/index');
const signupRouter = require('./Routes/Auth/signup');
const loginRouter = require('./Routes/Auth/login');
const logoutRouter = require('./Routes/Auth/logout');
const productRouter = require('./Routes/Products/product');
const consumerRouter = require('./Routes/Consumer/consumer');
const sellerRouter = require('./Routes/Seller/seller');
const addressRouter = require('./Routes/Address/address');
const cartRouter = require('./Routes/Inventory/cart');
const checkoutRouter = require('./Routes/Inventory/checkout');

// App
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Security Middleware
const helmet = require('helmet');
const cors = require('cors');

app.use(helmet());
app.use(cors());

// Routes
app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/products', productRouter);
app.use('/consumer', consumerRouter);
app.use('/seller', sellerRouter);
app.use('/address', addressRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Database Connection
(async () => await connectToMongoDB(process.env.DATABASE_URL))();

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;