const mongoose = require("mongoose");

const Exam = require("./../models/exam");
const FilledExam = require("./../models/filled-exam")

async function startExam(req, res){

  const user = req.user;
  if(!user) {
      res.status(401).send("Log in to continue.");
      return;
  }
  const uid = user._id;

  const id = req.query.id;
  const exam = await Exam.findById(mongoose.Types.ObjectId(id));

  if(!exam){
    res.status(400).send("This exam does not exist.");
    return;
  }

  
  // Check that the user has to do the test.
  if(!user.examsTodo.includes(id) || !exam.isPublished){
    res.status(403).send("Forbidden.");
    return;
  }

  // Check that this exam hasn't been done by the user already.
  // To continue an already started exam, use "/continue-exam"

  const existing = await FilledExam.find({
    examId: id,
    userId: uid,
  });

  if(existing.length > 0){
    res.status(400).send("Already started.");
    return;
  }

  const date = new Date();

  // Create a new filled exam containing now as start date.
  const filled = new FilledExam({
    examId: id,
    userId: uid,
    dateStarted: date,
    expiresAt: new Date(date + (exam.duration + 30) * 1000)
  });

  await filled.save();

  // Remove fields we do not wish to send from the exam objet.
  exam.targetGroups = null;
  exam.targetUsers = null;

  console.log("User " + user.name + " started the exam " + exam.title + " on " + date.toString());
  res.status(200).send(exam);
  

}

module.exports = startExam;