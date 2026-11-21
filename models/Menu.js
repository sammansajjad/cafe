
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['drink', 'food', 'dessert']
    },
    price: {
        type: Number,
        required: true,
        min: 0.01
    },
    available: {
        type: Boolean,
        default: true
    }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
