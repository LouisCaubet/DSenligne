// const mongoose = require("mongoose");

const Exam = require("./../models/exam");
const User = require("./../models/users");

async function myExams(req, res){

  // Get user from req with passport
  const user = await User.findOne({name: "testing"});
  console.log(user.name);
  console.log(user.examsTodo);

  let exams = [];

  for(let id of user.examsTodo){
    try {
      let exam = await Exam.findById(id);

      // This API call is only to retrieve the exams to do, not to actually start one.
      // Therefore, we do not want to send the exam content here.
      exam.questions = null;

      exams.push(exam);
    }
    catch(e){
      console.log("Could not find exam with id " + id);
    }
  }

  res.status(200).send(exams);

}

module.exports = myExams;