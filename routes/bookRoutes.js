// routes/bookRoutes.js
const express = require("express");
const multer = require("multer");
const router = express.Router();
const Book = require('../models/Book');

// Set up Multer for image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save images to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Use timestamp to prevent duplicates
    }
});

const upload = multer({ storage: storage });

// Route to add a new book with an image upload
router.post("/api/books", upload.single('coverImage'), async (req, res) => {
    const { title, author, rating } = req.body;
    const coverImagePath = req.file.path; // Path to the uploaded file

    try {
        const newBook = new Book({ title, author, rating, coverImagePath, reviews: [] });
        await newBook.save();
        // res.status(201).json({ message: "Book added successfully", book: newBook });
        res.redirect('/home2.html');
    } catch (error) {
        res.status(500).json({ message: "Error adding book" });
    }
});

// Route to delete a book by ID
router.delete("/api/books/:id", async (req, res) => {
    try {
        const bookId = req.params.id; // Get the ID from the request parameters
        const deletedBook = await Book.findByIdAndDelete(bookId);
        
        // Check if the book was found and deleted
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error); // Log the error for debugging
        res.status(500).json({ message: "Error deleting book" });
    }
});

// POST route for adding a review to a specific book
router.post("/api/books/:id/reviews", async (req, res) => {
    const bookId = req.params.id; // Get the book ID from the request parameters
    const { review, username } = req.body; // Extract review and username from the request body

    try {
        // Find the book by ID and push the new review into the reviews array
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { $push: { reviews: { review, username } } }, // Add the review and username
            { new: true } // Return the updated book
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(201).json({ message: "Review added successfully", book: updatedBook });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Error adding review" });
    }
});

// Route to fetch all books with images
router.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// DELETE route for deleting a specific review
router.delete("/api/books/:bookId/reviews/:reviewId", async (req, res) => {
    const { bookId, reviewId } = req.params;

    try {
        // Find the book by its ID and remove the review by its ID
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { $pull: { reviews: { _id: reviewId } } }, // Use $pull to remove the specific review by ID
            { new: true } // Return the updated book
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Review deleted successfully", book: updatedBook });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Error deleting review" });
    }
});



// Route to fetch books that contain reviews by a specific user
router.get("/api/my-reviews", async (req, res) => {
    const username = req.query.username;

    try {
        // Find books that contain reviews by the specified username
        const books = await Book.find({ "reviews.username": username });

        res.json(books);
    } catch (error) {
        console.error("Error fetching user's reviewed books:", error);
        res.status(500).json({ message: "Error fetching user's reviewed books" });
    }
});



// DELETE route for deleting a specific review
router.delete("/api/books/:bookId/reviews/:reviewId", async (req, res) => {
    const { bookId, reviewId } = req.params;

    try {
        // Find the book by its ID and remove the review by its ID
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { $pull: { reviews: { _id: reviewId } } }, // Use $pull to remove the specific review by ID
            { new: true } // Return the updated book
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Review deleted successfully", book: updatedBook });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Error deleting review" });
    }
});



module.exports = router;
