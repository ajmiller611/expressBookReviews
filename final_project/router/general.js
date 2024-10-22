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
    let promise = new Promise((resolve,reject) => {
        resolve(res.status(200).send(JSON.stringify(books,null, 4)));
    })
    promise.then(function() {
        console.log("From callback status code: " + res.statusCode);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let promise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            resolve(res.send(books[isbn]));
        } else {
            reject(res.status(404).send("ISBN not found."));
        }  
    })
    promise
        .then(function() {
            console.log("Callback success with status code: " + res.statusCode);
        })
        .catch(error => {
            console.error("Callback failed with status code: " + res.statusCode );
        })
    }
 );
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let promise = new Promise((resolve, reject) => {
        const author = req.params.author;
        const isbns = Object.keys(books);
        const found = false;
        isbns.forEach(isbn => {
            if (books[isbn]['author'] === author) {
                resolve(res.send(books[isbn]));
                found = true;
            }
        });
        if (!found) {
            reject(res.status(404).send("Author not found."));
        }
    })
    promise
        .then(function() {
            console.log("Callback success with status code: " + res.statusCode);
        })
        .catch(error => {
            console.error("Callback failed with status code: " + res.statusCode);
        })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let promise = new Promise((resolve, reject) => {
        const title = req.params.title;
        const isbns = Object.keys(books);
        const found = false;
        isbns.forEach(isbn => {
            if (books[isbn]['title'] === title) {
                resolve(res.send(books[isbn]));
                found = true;
            }
        });
        if (!found) {
            reject(res.status(404).send("Title not found."));
        }
    })
    promise
        .then(function() {
            console.log("Callback success with status code: " + res.statusCode);
        })
        .catch(error => {
            console.error("Callback failed with status code: " + res.statusCode);
        })
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
