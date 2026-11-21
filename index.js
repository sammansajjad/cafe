
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const Menu = require('./models/Menu');

const app = express();

app.use(express.json());

// Request logger
function logger(req, res, next) {
    const time = new Date().toLocaleTimeString();

    console.log(`[${time}] ${req.method} ${req.url}`);

    next();
}

app.use(logger);
app.use(express.static('public'));

// 1. GET all menu items (with optional category filtering)
app.get('/api/menu', async (req, res) => {
    try {
        const category = req.query.category;

        const filter = category ? { category } : {};

        const menu = await Menu.find(filter).select('-_id -__v').sort({ id: 1 });

        res.status(200).json(menu);

    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch menu items'
        });
    }
});

// 2. GET a single menu item by ID
app.get('/api/menu/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(404).json({
                error: 'Menu item not found'
            });
        }

        const item = await Menu.findOne({ id }).select('-_id -__v');

        if (!item) {
            return res.status(404).json({
                error: 'Menu item not found'
            });
        }

        res.status(200).json(item);

    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch menu item'
        });
    }
});

// 3. POST a new menu item
app.post('/api/menu', async (req, res) => {
    try {
        const { name, category, price, available } = req.body;

        if (
            !name ||
            price === undefined ||
            price === null ||
            !Number.isFinite(Number(price)) ||
            Number(price) <= 0
        ) {
            return res.status(400).json({
                error: 'Name and a valid price greater than 0 are required'
            });
        }

        const lastItem = await Menu.findOne().sort({ id: -1 });

        const newItem = await Menu.create({
            id: lastItem ? lastItem.id + 1 : 1,
            name,
            category,
            price: Number(price),
            available: available === undefined ? true : available
        });

        const responseItem = newItem.toObject();
        delete responseItem._id;
        delete responseItem.__v;

        res.status(201).json(responseItem);

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: error.message
            });
        }

        res.status(500).json({
            error: 'Failed to create menu item'
        });
    }
});

// 4. PATCH toggle availability
app.patch('/api/menu/:id/toggle', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(404).json({
                error: 'Menu item not found'
            });
        }

        const item = await Menu.findOne({ id });

        if (!item) {
            return res.status(404).json({
                error: 'Menu item not found'
            });
        }

        item.available = !item.available;

        await item.save();

        const responseItem = item.toObject();
        delete responseItem._id;
        delete responseItem.__v;

        res.status(200).json(responseItem);

    } catch (error) {
        res.status(500).json({
            error: 'Failed to update menu item availability'
        });
    }
});

// 5. DELETE a menu item
app.delete('/api/menu/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(404).json({
                error: 'Menu item not found'
            });
        }

        const deletedItem = await Menu.findOneAndDelete({ id });

        if (!deletedItem) {
            return res.status(404).json({
                error: 'Menu item not found'
            });
        }

        const responseItem = deletedItem.toObject();
        delete responseItem._id;
        delete responseItem.__v;

        res.status(200).json({
            message: 'Menu item deleted successfully',
            item: responseItem
        });

    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete menu item'
        });
    }
});

// Start server after database connection
const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    });
