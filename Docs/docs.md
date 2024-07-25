## API Endpoints

### Auth

1. **POST /signup**

   - Description: Register a new user.
   - Returns: JSON with status.
   - Request Body:
     ```json
     {
       "name": "string",
       "email": "string",
       "password": "string",
       "role": "consumer/seller"
     }
     ```
2. **POST /login**

   - Description: Login a user.
   - Returns: JSON with status.
   - Request Body:
     ```json
     {
       "email": "string",
       "password": "string"
     }
     ```
3. **POST /logout**

   - Description: Logout a user.
   - Returns: JSON with status.

### Address

1. **GET /address**

   - Description: Get all the saved addresses of the user.
   - Returns: JSON array.
2. **POST /address**

   - Description: Create a new address for the user.
   - Returns: `address_id`.
   - Request Body:
     ```json
     {
       "street": "string",
       "city": "string",
       "state": "string",
       "country": "string",
       "postalCode": "string"
     }
     ```
3. **PUT /address/:id**

   - Description: Update the address with the specified id.
   - Returns: JSON with status.
   - Request Body (all fields are optional):
     ```json
     {
       "street": "string",
       "city": "string",
       "state": "string",
       "country": "string",
       "postalCode": "string"
     }
     ```
4. **DELETE /address/:id**

   - Description: Delete the address with the given id.
   - Returns: JSON with status.

### Consumer

1. **POST /consumer/add/balance**

   - Description: Add money to the user's account.
   - Request Body:
     ```json
     {
       "amount": "number"
     }
     ```
   - Returns: JSON with status.
2. **GET /consumer/carts**

   - Description: Returns all the saved carts.
   - Returns: JSON array.
3. **GET /consumer/orders**

   - Description: Returns all the orders made by the consumer.
   - Returns: JSON array.

### Seller

1. **GET /seller/products**
   - Description: Returns all the products listed by the seller.
   - Returns: JSON array.

### Products

1. **GET /products**

   - Description: Returns all the products for both consumers and sellers.
   - Returns: JSON array.
2. **POST /products/product**

   - Description: List a product for a seller.
   - Returns: `product_id`.
   - Request Body:
     ```json
     {
       "name": "string",
       "price": "number",
       "description": "string (optional)",
       "category": "string",
       "stock": "number"
     }
     ```
   - Note: `category` should be one of ['Electronics', 'Clothing', 'Books', 'Food', 'Beauty', 'Sports', 'Other'].
3. **GET /products/product/:id**

   - Description: Get the specific product with the given id.
   - Returns: JSON object.
4. **PATCH /products/product/:id**

   - Description: Update the details of the given product.
   - Returns: JSON with status.
   - Request Body (all fields are optional):
     ```json
     {
       "name": "string",
       "price": "number",
       "description": "string (optional)",
       "category": "string",
       "stock": "number"
     }
     ```
5. **DELETE /products/product/:id**

   - Description: Delete the product with the given id.
   - Returns: JSON with status.

### Cart

1. **POST /cart**

   - Description: Creates a new cart for the consumer.
   - Returns: `cart_id`.
2. **GET /cart/:id**

   - Description: Get the cart with the given id.
   - Returns: JSON object.
3. **DELETE /cart/:id**

   - Description: Delete the cart with the given id.
   - Returns: JSON with status.
4. **POST /cart/:id/item**

   - Description: Add a product to the cart.
   - Returns: `item_id`.
   - Request Body:
     ```json
     {
       "product_id": "string",
       "quantity": "number"
     }
     ```
5. **PATCH /cart/:id/item/:pid**

   - Description: Update the quantity of the item (pid) in the cart (id).
   - Returns: JSON with status.
   - Request Body:
     ```json
     {
       "quantity": "number"
     }
     ```
6. **DELETE /cart/:id/item/:pid**

   - Description: Delete the item (pid) from the cart (id).
   - Returns: JSON with status.

### Checkout

1. **POST /checkout/:id**
   - Description: Create an order for the cart with the given id.
   - Returns: JSON object of order details.
   - Request Body:
     ```json
     {
       "address_id": "string"
     }
     ```

   - Info: Upon successful validation, the amount is deducted from the consumer's account and transferred to their respective seller's account. The cart is deleted and the product's stock is updated. The transaction is atomic to ensure no data inconsistency.

