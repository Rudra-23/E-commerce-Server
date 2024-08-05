# E-commerce API

This is an E-commerce API that provides functionality for authentication, authorization, and various operations for sellers and consumers. It supports creating and managing products, carts, and orders, and ensures data consistency through atomic transactions.

## Features

- **Authentication & Authorization**: Secure signup and login with access control for different user roles.
- **Seller Operations**: Sellers can add, update, and delete products.
- **Consumer Operations**:
  - Consumers can create multiple carts and add products to the cart from different sellers.
  - Consumers can have multiple addresses.
  - Consumers can checkout a cart using any of their saved addresses.
- **Order Processing**:
  - Validations are performed for each order.
  - Amount is deducted from the consumer and transferred to the seller upon successful order processing.
  - Transactions are atomic, ensuring no data inconsistency.
 
## API Endpoints

Check details here: <a href ="./Docs/docs.md"> docs </a>

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/e-commerce-api.git
   cd e-commerce-api
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following variables:

   ```env
   DATABASE_URL=your_mongodb_connection_string
   SECRET_KEY=your_secret_key
   ```
4. Start the server:

   ```bash
   npm start
   ```

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens) for authentication
- bcrypt for password hashing

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.
