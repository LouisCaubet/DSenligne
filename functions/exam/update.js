const Exam = require("../models/exam");

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


    const id = mongoose.Types.ObjectId(req.params.id);

    let set = req.body;
    set.isPublished = undefined;
    set.owner = undefined;


    if(user.isadmin){
        await Exam.updateOne({
            _id: id,
            isPublished: false
        }, {
            $set: set
        });
    }
    else {
        await Exam.updateOne({
            _id: id,
            owner: user._id,
            isPublished: false
        }, {
            $set: set
        });
    }

    const updated = await Exam.findbyId(id);

    res.status(200).send(updated);

}

module.exports = editExam;