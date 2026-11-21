
require('dotenv').config();

const connectDB = require('./config/db');
const Menu = require('./models/Menu');

const menuItems = [
    { id: 1, name: 'Espresso', category: 'drink', price: 250, available: true },
    { id: 2, name: 'Club Sandwich', category: 'food', price: 550, available: true },
    { id: 3, name: 'Chocolate Muffin', category: 'dessert', price: 300, available: false },
    { id: 4, name: 'Cappuccino', category: 'drink', price: 350, available: true },
    { id: 5, name: 'Chicken Burger', category: 'food', price: 650, available: true },
    { id: 6, name: 'French Fries', category: 'food', price: 300, available: true },
    { id: 7, name: 'Chocolate Cake', category: 'dessert', price: 400, available: true },
    { id: 8, name: 'Fresh Orange Juice', category: 'drink', price: 280, available: true },
    { id: 9, name: 'Chicken Pizza', category: 'food', price: 900, available: false },
    { id: 10, name: 'Ice Cream', category: 'dessert', price: 200, available: true }
];

const seedMenu = async () => {
    try {
        await connectDB();

        await Menu.deleteMany({});
        await Menu.insertMany(menuItems);

        console.log('10 menu items inserted successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error.message);
        process.exit(1);
    }
};

seedMenu();
