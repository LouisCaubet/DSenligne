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


    const nb_ids = JSON.parse(req.query.ids);

    let ids = [];
    for(let i of nb_ids){

        let id = mongoose.Types.ObjectId(i);

        if(!user.isadmin){
            let exam = await Exam.findById(id);
            if(exam.owner != user._id){
                continue;
            }
        }

        ids.push(id);
    }

    
    await FilledExam.deleteMany({
        examId: {$in: ids}
    });

    await Exam.deleteMany({
        _id: {$in: ids}
    });

    res.status(200).send(nb_ids);

}

module.exports = deleteExam;