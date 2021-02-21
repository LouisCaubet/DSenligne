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


app.post("/api/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err); 
    }
    if (!user) { 
      return res.send({success: false, firstname: null, lastname: null, interface: "invite"});
    }

    req.login(user, function(err) {
      if (err) { 
        return next(err);
      }
      let interface = "student"
      if(user.isadmin) interface = "admin"
      else if(user.isteacher) interface = "teacher"
      return res.send({success: true, firstname: user.firstname, lastname: user.lastname, interface: interface});
    });
  })(req, res, next);
});


// Create a new user account
app.post("/api/register", require("./requests/register"));


/// ADMIN API

// GETLIST EXAM / GETMANY EXAM
app.get("/api/exam", require("./exam/getlist"));

// GETONE EXAM
app.get("/api/exam/:id", require("./exam/getone"));

// CREATE EXAM
app.post("/api/exam", require("./exam/create"));

// UPDATE EXAM
app.put("/api/exam/:id", require("./exam/update"));

// UPDATEMANY EXAM
app.put("/api/exam", require("./exam/updatemany"));

// DELETE EXAM
app.delete("/api/exam/:id", require("./exam/delete"));

// DELETEMANY EXAM
app.delete("/api/exam", require("./exam/deletemany"));

// Publish the exam
app.post("/api/publish-exam", require("./requests/publish-exam"));



// GETLIST FILLEDEXAM / GETMANY FILLEDEXAM
app.get("/api/filledexam", require("./filledexam/getlist"));

// GETONE FILLEDEXAM
app.get("/api/filledexam/:id", require("./filledexam/getone"));



// Create a new empty group
app.post("/api/create-group", require("./requests/create-group"));

// Edit a group
app.post("/api/edit-group", require("./requests/edit-group"));

// Get groups
app.get("/api/groups", require("./requests/get-groups"));

// Returns all users (eventually only from the same org)
app.get("/api/all-users", require("./requests/get-users"));


/// USER API

// Sends the content of an exam to the client, and sets it as started.
app.get("/api/start-exam", require("./requests/start-exam"));

// Sends all the exams the user has to do (without their content)
app.get("/api/myexams", require("./requests/my-exams"));

// Saves answers to an already started exam
app.post("/api/send-answers", require("./requests/send-answers"));

// Get ongoing exam, or null if none is ongoing
app.get("/api/ongoing-exam", require("./requests/getongoingexam"));


exports.api = functions.https.onRequest(app);
