const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered."})
        } else {
            return res.status(404).json({message: "User already exists."});
        }
    }
    return res.status(404).json({message: "Unable to regiser user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn]);
    } else {
        res.status(404).send("ISBN not found.");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const isbns = Object.keys(books);
    isbns.forEach(isbn => {
        if (books[isbn]['author'] === author) {
            res.send(books[isbn]);
        }
    });
    //res.status(404).send("Author not found.");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const isbns = Object.keys(books);
    isbns.forEach(isbn => {
        if (books[isbn]['title'] === title) {
            res.send(books[isbn]);
        }
    });
    //res.status(404).send("Title not found.");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn]['reviews']);
    } else {
        res.status(404).send("ISBN not found.");
    }
});

module.exports.general = public_users;
