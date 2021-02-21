const Exam = require("../models/exam");
const FilledExam = require("../models/filled-exam")

const mongoose = require("mongoose");

async function deleteExam(req, res){

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

    let exam = await Exam.findById(id);

    if(!exam){
        res.status(400).send("Bad id");
        return;
    }

    if(!user.isadmin && exam.owner != user._id){
        res.status(403).send("Forbidden");
        return;
    }

    await FilledExam.deleteMany({
        examId: id
    });

    if(user.isadmin){

        await Exam.deleteOne({
            _id: id
        });
    }
    else {

        await Exam.deleteOne({
            _id: id,
            owner: user._id
        });
    }

    res.status(200).send(exam);

}

module.exports = deleteExam;