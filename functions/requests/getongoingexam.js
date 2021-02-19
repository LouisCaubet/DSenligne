const mongoose = require("mongoose");

const Exam = require("./../models/exam");
const FilledExam = require("./../models/filled-exam")

async function getOngoingExam(req, res){

    const user = req.user;

    if(!user){
        res.status(401).send("Log in to continue");
        return;
    }

    if(!user.ongoingExam){
        res.send(null);
        return;
    }

    const exam = await Exam.findById(user.ongoingExam);
    const filled = await FilledExam.findOne({
        examId: user.ongoingExam,
        userId: user._id
    });

    if(!exam || !filled){
        res.status(500).send("Unexpected error.");
        return;
    }

    // Margin of 30s of time to have time to handle the final save request.
    // Can't be used without altering the frontend, and would not provide a 
    // significant advantage if maliciously used.
    if((new Date() - filled.dateStarted) / 1000 > exam.duration + 30){
        // Exam time exceeded. 
        user.ongoingExam = null;
        user.save();
        res.send(null)
        return;
    }

    res.send({exam: exam, filled: filled});

}

module.exports = getOngoingExam;