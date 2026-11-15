
const express = require('express');

const app = express();

app.use(express.json());

function logger(req, res, next) {
    const time = new Date().toLocaleTimeString();

    console.log(`[${time}] ${req.method} ${req.url}`);

    next();
}

app.use(logger);
app.use(express.static('public'));
let menu = [
    { id: 1, name: 'Espresso', category: 'drink', price: 250, available: true },
    { id: 2, name: 'Club Sandwich', category: 'food', price: 550, available: true },
    { id: 3, name: 'Chocolate Muffin', category: 'dessert', price: 300, available: false }
];

// 1. GET all menu items
app.get('/api/menu', (req, res) => {
    const category = req.query.category;

    if (category) {
        const filteredMenu = menu.filter(item => item.category === category);
        return res.status(200).json(filteredMenu);
    }

    res.status(200).json(menu);
});

// 2. GET a single menu item by ID
app.get('/api/menu/:id', (req, res) => {
    const id = Number(req.params.id);

    const item = menu.find(item => item.id === id);

    if (!item) {
        return res.status(404).json({
            error: 'Menu item not found'
        });
    }

    res.status(200).json(item);
});

// 3. POST a new menu item
app.post('/api/menu', (req, res) => {
    const { name, category, price, available } = req.body;

    if (!name || price === undefined || price === null || !Number.isFinite(Number(price)) || Number(price) <= 0) {
        return res.status(400).json({
            error: 'Name and a valid price greater than 0 are required'
        });
    }

    const newItem = {
        id: menu.length > 0 ? Math.max(...menu.map(item => item.id)) + 1 : 1,
        name,
        category,
        price: Number(price),
        available: available === undefined ? true : available
    };

    menu.push(newItem);

    res.status(201).json(newItem);
});

// 4. PATCH toggle availability
app.patch('/api/menu/:id/toggle', (req, res) => {
    const id = Number(req.params.id);

    const item = menu.find(item => item.id === id);

    if (!item) {
        return res.status(404).json({
            error: 'Menu item not found'
        });
    }

    item.available = !item.available;

    res.status(200).json(item);
});

// 5. DELETE a menu item
app.delete('/api/menu/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = menu.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: 'Menu item not found'
        });
    }

    const deletedItem = menu.splice(index, 1);

    res.status(200).json({
        message: 'Menu item deleted successfully',
        item: deletedItem[0]
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
