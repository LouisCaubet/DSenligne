// const mongoose = require("mongoose");

const FilledExam = require("../models/filled-exam");
const Exam = require("./../models/exam");

async function myExams(req, res){

  // Get user from req with passport
  const user = req.user

  if(!user){
    res.status(401).send("Log in to continue")
    return
  }

  let exams = [];

  for(let id of user.examsTodo){
    try {
      let exam = await Exam.findById(id);

      // This API call is only to retrieve the exams to do, not to actually start one.
      // Therefore, we do not want to send the exam content here.
      exam.questions = null;

      // Check if we're still in the deadline
      if(new Date(exam.dueDate) < new Date()){
        continue;
      }

      // Check if the exam has already been done
      let filled = await FilledExam.findOne({
        examId: id,
        userId: user._id
      });

      if(filled){
        user.examsTodo.splice(user.examsTodo.indexOf(id), 1);
        user.save();
        continue;
      }

      exams.push(exam);
    }
    catch(e){
      console.log("Could not find exam with id " + id);
    }
  }

  res.status(200).send(exams);

}

module.exports = myExams;