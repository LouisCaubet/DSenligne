const mongoose = require("mongoose");

const Exam = require("./../models/exam");
const FilledExam = require("./../models/filled-exam")

async function sendAnswers(req, res){

  let arg = null;

  try {
    arg = req.body;
  }
  catch(e){
    console.log("Failure to parse JSON");
    console.log(e.stack);
    res.status(400).send("Invalid JSON");
    return;
  }

  const user = req.user;

  if(!user){
    res.status(401).send("Log in to continue.");
  }

  const uid = user._id;

  const examId = mongoose.Types.ObjectId(arg.examId);
  const done = arg.done;
  const answers = arg.answers;

  let filled = null;


  filled = await FilledExam.findOne({
    examId: examId,
    userId: uid
  });

  if(!filled){
    res.status(400).send("This exam has not been started. Use /start-exam to start an exam.");
    return;
  }
  

  const exam = await Exam.findById(examId);

  if(!exam){
    res.status(400).send("This exam doesnt exist");
  }

  // Margin of 30s of time to have time to handle the final save request.
  // Can't be used without altering the frontend, and would not provide a 
  // significant advantage if maliciously used.
  if((new Date() - filled.dateStarted) / 1000 > exam.duration + 30){
    // Exam time exceeded. 
    res.status(403).send("Exam time exceeded");
    return;
  }

  await FilledExam.updateOne({
    examId: examId,
    userId: uid,
  },
  {
    $set: {
      done: done,
      answers: answers
    }
  });

  if(done){
    user.ongoingExam = null;
    user.save();
  }

  res.status(200).send("Successfully saved answers");

}

module.exports = sendAnswers;