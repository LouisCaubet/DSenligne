const Exam = require("./../models/exam");

async function createExam(req, res){

  const user = req.user;

  if(!user){
    res.status(401).send("Log in to continue");
    return;
  }
  
  if(!user.isteacher && !user.isadmin){
    res.status(403).send("This command requires teacher privileges or higher.");
    return;
  }

  const arg = req.body;
  

  const title = arg.title;
  const questions = arg.questions;
  const dueDate = arg.dueDate;
  const description = arg.description || "";
  const duration = arg.duration;

  if(!title || !questions || !dueDate || !duration){
    res.statusCode = 400;
    res.statusMessage = "Missing argument(s)";
    return;
  }

  const exam = new Exam({
    title:title,
    questions:questions,
    dueDate: new Date(dueDate),
    description: description,
    duration: duration,
    owner: user._id,
    targetUsers: [],
    targetGroups: []
  });

  console.log("Adding exam to the DB");

  await exam.save();

  console.log("Added (1) exam to the DB!");

  res.statusCode = 200;
  res.send(exam._id);

}

module.exports = createExam;
