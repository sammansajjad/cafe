# Brewberry Café — REST API & Website

A playful café website powered by a Node.js and Express.js REST API with MongoDB Atlas for persistent menu storage. Brewberry allows customers to explore a dynamic café menu, filter food and drinks, build an order preview, adjust item quantities, and calculate discounts.

## Features

### Frontend
- Responsive café website with a playful design.
- Light and dark mode toggle.
- Dynamic menu loaded from the REST API.
- Menu filtering by category:
  - Drinks
  - Food
  - Pastries
- Interactive order selection.
- Increase or decrease item quantities.
- Remove items from the order summary.
- Automatic subtotal, discount, and final total calculation.
- Student discount (10%).
- Senior discount (15%).
- Contact form with name and email validation.
- Message character counter.
- Café opening-hours status.

### Backend
- REST API built with Node.js and Express.js.
- MongoDB Atlas database integration.
- Mongoose schema and model for menu items.
- Retrieve all menu items.
- Filter menu items by category.
- Retrieve an individual menu item by ID.
- Add new menu items.
- Toggle menu item availability.
- Delete menu items.
- JSON request handling.
- Custom request-logging middleware.
- Database seeding script for initial menu data.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Frontend functionality and API integration |
| Node.js | JavaScript runtime |
| Express.js | REST API development |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| dotenv | Environment variable management |
| Nodemon | Automatic server restarting |
| Postman / Thunder Client | API testing |

## Project Structure

```text
cafe-api/
│
├── config/
│   └── db.js
│
├── models/
│   └── Menu.js
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
├── index.js
├── seedMenu.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

### 2. Navigate to the project directory

```bash
cd cafe-api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root directory.

Add the following configuration:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=3000
```

Replace `your_mongodb_atlas_connection_string` with your own MongoDB Atlas connection string.

**Important:** Never upload your `.env` file or database credentials to GitHub. The `.env` file is excluded through `.gitignore`.

### 5. Seed the initial menu data

Run the following command:

```bash
node seedMenu.js
```

This script connects to MongoDB Atlas and inserts the 10 initial menu items.

**Note:** The seed script clears existing menu records before inserting the initial data. Run it only when you intentionally want to reset the menu.

### 6. Start the development server

```bash
npm run dev
```

The application will run at:

```text
http://localhost:3000
```

Open this address in your browser to access the Brewberry website.

**Important:** Open the website through the Express server rather than using VS Code Live Server. This ensures that frontend API requests reach the correct server.

## Database Structure

The application uses MongoDB Atlas for persistent menu storage and Mongoose for defining the menu schema.

### Menu Schema

| Field | Data Type | Description |
|---|---|---|
| id | Number | Unique numeric menu item ID |
| name | String | Menu item name |
| category | String | drink, food, or dessert |
| price | Number | Menu item price |
| available | Boolean | Item availability status |

MongoDB also automatically generates its own `_id` field for each document.

### Initial Menu Data

The application is initialized with the following 10 menu items:

| ID | Item | Category | Price (PKR) | Availability |
|---:|---|---|---:|---|
| 1 | Espresso | Drink | 250 | Available |
| 2 | Club Sandwich | Food | 550 | Available |
| 3 | Chocolate Muffin | Dessert | 300 | Unavailable |
| 4 | Cappuccino | Drink | 350 | Available |
| 5 | Chicken Burger | Food | 650 | Available |
| 6 | French Fries | Food | 300 | Available |
| 7 | Chocolate Cake | Dessert | 400 | Available |
| 8 | Fresh Orange Juice | Drink | 280 | Available |
| 9 | Chicken Pizza | Food | 900 | Unavailable |
| 10 | Ice Cream | Dessert | 200 | Available |

## REST API Documentation

Base URL:

```text
http://localhost:3000
```

### 1. Get All Menu Items

**Method:** GET

**Endpoint:**

```http
GET /api/menu
```

Returns all menu records stored in MongoDB.

Example:

```http
GET http://localhost:3000/api/menu
```

### 2. Filter Menu by Category

**Method:** GET

**Endpoint:**

```http
GET /api/menu?category=drink
```

Supported categories:

- `drink`
- `food`
- `dessert`

Example:

```http
GET http://localhost:3000/api/menu?category=drink
```

Returns only menu items belonging to the selected category.

### 3. Get a Menu Item by ID

**Method:** GET

**Endpoint:**

```http
GET /api/menu/:id
```

Example:

```http
GET http://localhost:3000/api/menu/1
```

Returns a single menu item matching the specified numeric ID.

### 4. Add a New Menu Item

**Method:** POST

**Endpoint:**

```http
POST /api/menu
```

Request body:

```json
{
    "name": "Vanilla Latte",
    "category": "drink",
    "price": 380,
    "available": true
}
```

Set the request body type to JSON in Postman or Thunder Client.

The API generates a numeric ID and stores the new menu item in MongoDB.

### 5. Toggle Menu Item Availability

**Method:** PATCH

**Endpoint:**

```http
PATCH /api/menu/:id/toggle
```

Example:

```http
PATCH http://localhost:3000/api/menu/1/toggle
```

Changes an item's availability status between `true` and `false` and saves the update in MongoDB.

### 6. Delete a Menu Item

**Method:** DELETE

**Endpoint:**

```http
DELETE /api/menu/:id
```

Example:

```http
DELETE http://localhost:3000/api/menu/1
```

Deletes the specified menu item from MongoDB.

## Order and Discount Calculation

The frontend provides an interactive order preview.

Customers can:

1. Select menu items.
2. Increase or decrease quantities.
3. Remove items from their order.
4. Select an available discount option.
5. View the updated subtotal, discount, and final total.

The calculation follows these formulas:

**Subtotal**

```text
Subtotal = Sum of (Item Price × Quantity)
```

**Discount Amount**

```text
Discount = Subtotal × Discount Percentage
```

**Final Total**

```text
Final Total = Subtotal − Discount
```

Available discount options:

| Discount | Percentage |
|---|---:|
| No Discount | 0% |
| Student Discount | 10% |
| Senior Discount | 15% |

## Testing

The REST API can be tested using Postman or Thunder Client.

Recommended test sequence:

1. Retrieve all menu items using GET.
2. Filter menu items by category.
3. Retrieve an individual item by ID.
4. Add a new menu item using POST.
5. Toggle its availability using PATCH.
6. Delete a menu item using DELETE.

The frontend can also be tested by selecting menu items, changing quantities, applying discounts, and submitting the contact form.

The database integration was tested by performing CRUD operations and verifying that menu changes were reflected in MongoDB Atlas.

## Current Limitations

- Menu management is connected to MongoDB Atlas, but there is no dedicated administrator interface.
- Orders are calculated on the frontend and are not submitted to the backend.
- Customer orders are not stored in the database.
- No payment gateway or online checkout is available.
- The contact form currently provides frontend validation and a confirmation message; it does not send messages to a backend service.
- Authentication and authorization are not implemented.

## Future Improvements

- Add backend order management.
- Store customer orders in MongoDB.
- Implement customer and administrator authentication.
- Add an administrator dashboard for menu management.
- Implement a real checkout process.
- Integrate an online payment gateway.
- Improve backend validation and error handling.

## Learning Objectives

This project demonstrates practical implementation of:

- RESTful API development.
- HTTP methods and API endpoints.
- Express.js routing and middleware.
- MongoDB Atlas database integration.
- Mongoose schemas and models.
- CRUD operations using MongoDB.
- Environment variable management.
- Frontend and backend integration using Fetch API.
- DOM manipulation and event handling.
- Dynamic content rendering.
- Basic order calculations and discount logic.
- API testing using Postman and Thunder Client.

## License

This project is developed for educational and learning purposes.
