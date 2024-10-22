const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Username or Password is missing."});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access',  { expiresIn: 60 * 60});

        req.session.authorization = {
            accessToken, username
        }
            console.log(req.session);
        return res.status(200).send("User successfully logged in.");
    } else {
        return res.status(208).json({message: "Invalid login. Check username and password."});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const querystring = req.params.querystring;
    console.log(querystring);
    if (books[isbn]) {

        Object.keys(books[isbn]['reviews']).forEach(review => {
            if (review[username] === username) {
                review[username] = querystring;
            } else {
                review[username] = querystring;
            }
        });
        console.log(books[isbn]['reviews'][username]);
        res.send("Review for ISBN " + isbn + " has been added.");
    } else {
        res.send("ISBN not found.");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        delete books[isbn]['reviews'][username];
    }
    res.send("Review for ISBN " + isbn + " has been deleted.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
