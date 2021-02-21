const Exam = require("../models/exam");

const mongoose = require("mongoose");

async function getExam(req, res){

    const user = req.user;

    if(!user){
        res.status(401).send("Log in to continue.");
        return;
    }

    if(!user.isteacher && !user.isadmin){
        res.status(403).send("This command requires teacher privileges or higher.");
        return;
    }

    const id = req.params.id;

    const exam = await Exam.findById(mongoose.Types.ObjectId(id));

    if(!exam || (exam.owner != user._id && !user.isadmin)){
        res.status(400).send("This exam does not exist.");
        return;
    }

    res.status(200).send(exam);

}

module.exports = getExam;