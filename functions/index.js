const functions = require("firebase-functions");
const express = require("express");
const session = require("express-session");
const passport = require("./passport");
const mongoose = require("mongoose");

const Exam = require("./models/exam");
const User = require("./models/users");
const FilledExam = require("./models/filled-exam")


// Start Express.js App
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(session({secret: "oweuhfiz8uwrfoh"}));
app.use(passport.initialize());
app.use(passport.session());

let port = 8080;
app.listen(port, () => {
  "API listening on port 8080"
});

// Connection to MongoDB
const uri = "mongodb+srv://admin:CIb2xxSDNI8iIrmR@cluster0.xzps9.mongodb.net/dsenligne?retryWrites=true&w=majority";
mongoose.connect(uri).then(() => console.log("Connection to MongoDB successful!")).catch((err) => console.log(err));


app.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err); 
    }
    if (!user) { 
      return res.send({redirect: "#login"});
    }

    req.login(user, function(err) {
      if (err) { 
        return next(err);
      }
      return res.send({redirect: "#dashboard"});
    });
  })(req, res, next);
});


// Create a new user account
app.post("/register", require("./requests/register"));


/// ADMIN API

// Creates a new Exam in the DB.
app.post("/create-exam", require("./requests/create-exam"));

// Edit an existing unpublished exam
app.post("/edit-exam", require("./requests/edit-exam"));

// Publish the exam
app.post("/publish-exam", require("./requests/publish-exam"));

// Get unpublished exams
app.get("/get-draft-exams", require("./requests/get-draft-exams"));

// Get published exams
app.get("/get-published-exams", require("./requests/get-published-exams"));

// Get one specific exam by id
app.get("/get-exam", require("./requests/get-exam"));

// Get filled exams to correct
app.get("/tocorrect", require("./requests/get-tocorrect"));

// Create a new empty group
app.post("/create-group", require("./requests/create-group"));

// Edit a group
app.post("/edit-group", require("./requests/edit-group"));

// Get groups
app.get("/groups", require("./requests/get-groups"));

// Returns all users (eventually only from the same org)
app.get("/all-users", require("./requests/get-users"));


/// USER API

// Sends the content of an exam to the client, and sets it as started.
app.get("/start-exam", require("./requests/start-exam"));

// Sends all the exams the user has to do (without their content)
app.get("/myexams", require("./requests/my-exams"));

// Saves answers to an already started exam
app.post("/send-answers", require("./requests/send-answers"));


exports.api = functions.https.onRequest(app);
