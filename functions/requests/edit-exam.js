const Exam = require("./../models/exam");

const mongoose = require("mongoose");

async function editExam(req, res){

    const user = req.user;

    if(!user){
        res.status(401).send("Log in to continue.");
        return;
    }

    if(!user.isteacher && !user.isadmin){
        res.status(403).send("This command requires teacher privileges or higher.");
        return;
      }

    let arg = req.body;

    const id = mongoose.Types.ObjectId(arg.id);
    const title = arg.title;
    const questions = arg.questions;
    const dueDate = arg.dueDate;
    const description = arg.description || "";
    const duration = arg.duration;
    const targetedGroups = arg.targetGroups;
    const targetedUsers = arg.targetUsers;

  
    if(!title || !questions || !dueDate || !duration || targetedGroups === null || targetedUsers === null){
      res.status(400).send("Missing arguments");
      return;
    }

    // Find exam.
    const exam = await Exam.findById(id);

    if(!exam){
        res.status(400).send("Unknown exam id.");
        return;
    }

    if(exam.owner != user._id && !user.isadmin){
        res.status(403).send("You don't have ownership of this exam. Admin privileges required.");
        return;
    }

    if(exam.isPublished){
        res.status(403).send("This exam cannot be edited, as it has already been published.");
        return;
    }

    exam.title = title;
    exam.questions = questions;
    exam.dueDate = dueDate;
    exam.description = description;
    exam.duration = duration;
    exam.targetGroups = targetedGroups;
    exam.targetUsers = targetedUsers;

    await exam.save();

    res.status(200).send("Successfully saved changes.");

}

module.exports = editExam;