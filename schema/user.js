"use strict";

const mongoose = require("mongoose");

/**
 * Define the Mongoose Schema for a User.
 */
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    location: String,
    description: String,
    occupation: String,
    login_name: {
        type: String,
        required: true,
        unique: true // Ensure login names are unique
    },
    password: String // Add a field for storing user passwords
});

/**
 * Create a Mongoose Model for a User using the userSchema.
 */
const User = mongoose.model("User", userSchema);

/**
 * Make this available to our application.
 */
module.exports = User;
