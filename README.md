# Brewberry Café — REST API & Website

A playful café website powered by a Node.js and Express.js REST API. Brewberry allows customers to explore a dynamic café menu, filter food and drinks, build an order preview, adjust item quantities, and calculate discounts.

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
- Retrieve all menu items.
- Filter menu items by category.
- Retrieve an individual menu item by ID.
- Add new menu items.
- Toggle menu item availability.
- Delete menu items.
- JSON request handling.
- Custom request-logging middleware.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Frontend functionality and API integration |
| Node.js | JavaScript runtime |
| Express.js | REST API development |
| Nodemon | Automatic server restarting |
| Postman | API testing |

## Project Structure

```text
cafe-api/
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
├── index.js
├── package.json
├── package-lock.json
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

### 4. Start the development server

```bash
npm run dev
```

The application will run at:

```text
http://localhost:3000
```

Open this address in your browser to access the Brewberry website.

**Important:** Open the website through the Express server rather than using VS Code Live Server. This ensures that frontend API requests reach the correct server.

## REST API Documentation

Base URL:

```text
http://localhost:3000
```

### 1. Get All Menu Items

**Endpoint:**

```http
GET /api/menu
```

Returns all available menu records.

Example:

```http
GET http://localhost:3000/api/menu
```

### 2. Filter Menu by Category

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

### 3. Get a Menu Item by ID

**Endpoint:**

```http
GET /api/menu/:id
```

Example:

```http
GET http://localhost:3000/api/menu/1
```

### 4. Add a New Menu Item

**Endpoint:**

```http
POST /api/menu
```

Request body:

```json
{
    "name": "Cappuccino",
    "category": "drink",
    "price": 350,
    "available": true
}
```

Set the request body type to JSON in Postman.

### 5. Toggle Menu Item Availability

**Endpoint:**

```http
PATCH /api/menu/:id/toggle
```

Example:

```http
PATCH http://localhost:3000/api/menu/1/toggle
```

This changes an item's availability status between `true` and `false`.

### 6. Delete a Menu Item

**Endpoint:**

```http
DELETE /api/menu/:id
```

Example:

```http
DELETE http://localhost:3000/api/menu/1
```

## Initial Menu Data

The application starts with the following sample menu items:

| ID | Item | Category | Price (PKR) | Availability |
|---|---|---|---:|---|
| 1 | Espresso | Drink | 250 | Available |
| 2 | Club Sandwich | Food | 550 | Available |
| 3 | Chocolate Muffin | Dessert | 300 | Unavailable |

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

The REST API can be tested using Postman.

Recommended test sequence:

1. Retrieve all menu items using GET.
2. Filter menu items by category.
3. Retrieve an individual item by ID.
4. Add a new menu item using POST.
5. Toggle its availability using PATCH.
6. Delete a menu item using DELETE.

The frontend can also be tested by selecting menu items, changing quantities, applying discounts, and submitting the contact form.

## Current Limitations

- Menu data is stored in an in-memory JavaScript array.
- Menu changes are not permanently saved and reset when the server restarts.
- Orders are calculated on the frontend and are not submitted to the backend.
- No database integration is currently implemented.
- No payment gateway or online checkout is available.
- The contact form currently provides frontend validation and a confirmation message; it does not send messages to a backend service.

## Future Improvements

- Integrate MySQL for persistent menu storage.
- Add backend order management.
- Store customer orders in a database.
- Implement customer and administrator authentication.
- Add a real checkout process.
- Integrate an online payment gateway.
- Add backend validation and error handling.

## Learning Objectives

This project demonstrates practical implementation of:

- RESTful API development.
- HTTP methods and API endpoints.
- Express.js routing and middleware.
- JSON request and response handling.
- Frontend and backend integration using Fetch API.
- DOM manipulation and event handling.
- Dynamic content rendering.
- Basic order calculations and discount logic.
- API testing using Postman.

## License

This project is developed for educational and learning purposes.