// Require the Express Module
const express = require('express');
// Create an Express App
const app = express();
const mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');
let UserSchema = new mongoose.Schema({
    name: String,
    age: Number
})
mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
let User = mongoose.model('User'); // We are retrieving this Schema from our Models, named 'User'
// Require body-parser (to receive post data from clients)
const bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
const path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
mongoose.Promise = global.Promise;
app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    User.find({}, function (err, users) {
        if (!err) {
            console.log(users[1].name);
            console.log('got users!');
            res.render('index', {users: users})

        }
        else {
            console.log("couldn't retrieve users");
            res.render('index');
        }
    });
    // res.render('index');
});
// Add User Request
app.post('/users', function(req, res) {
    console.log("POST DATA", req.body);
    // create a new User with the name and age corresponding to those from req.body
    let user = new User({name: req.body.name, age: req.body.age,});
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    user.save(function (err) {
        if (err) {
            // if there is an error console.log that something went wrong!
            console.log('Something went wrong');
        }
        else { // else console.log that we did well and then redirect to the root route
            console.log('Added a user!');
        }
    });
    // This is where we would add the user from req.body to the database.
    res.redirect('/');
});
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});