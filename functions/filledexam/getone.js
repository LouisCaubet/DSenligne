const Exam = require("../models/exam");
const FilledExam = require("../models/filled-exam");

const mongoose = require("mongoose");

async function getFilledExam(req, res){

    const user = req.user;

    if(!user){
        res.status(401).send("Log in to continue.");
        return;
    }

    if(!user.isteacher && !user.isadmin){
        res.status(403).send("This command requires teacher privileges or higher.");
        return;
    }

    const id = mongoose.Types.ObjectId(req.params.id);

    const filled = await FilledExam.findById(id);

    if(!user.isadmin){
        const exam = await Exam.findById(filled.examId);
        if(!exam || exam.owner != user._id){
            res.status(403).send();
            return;
        }
    }

    res.status(200).send(filled);

}

module.exports = getFilledExam;