// routes/userroutes.js
const express = require("express");
const router = express.Router();
const UserModel = require('../models/usermodels');
const bcrypt = require('bcrypt');

router.post("/sign_up", async (req, res) => {
    const { name, age, email, phone, gender, password } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            name,
            age,
            email,
            phone,
            gender,
            password: hashedPassword // Store the hashed password
        };

        await UserModel.create(data); // Use await for asynchronous operation
        console.log("Record inserted successfully");
        return res.redirect('login.html');
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Incorrect email" }); // Return error if email not found
        }

        // Compare the provided password with the hashed password in the database
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Incorrect password" }); // Return error if password doesn't match
        }

        console.log("Login successful");
        // Send the username in the response
        return res.json({ username: user.name });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
});


module.exports = router;
