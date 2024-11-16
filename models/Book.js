// models/Book.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    username: String,
    review: String,
    createdAt: { type: Date, default: Date.now }
});

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    rating: { type: Number, required: true },
    coverImagePath: { type: String, required: true }, // Path to image file
    reviews:  [reviewSchema], // Reviews stored as strings
});

module.exports = mongoose.model('Book', bookSchema);
