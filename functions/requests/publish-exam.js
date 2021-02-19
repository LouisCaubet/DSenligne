const Exam = require("./../models/exam");
const User = require("./../models/users");
const Group = require("./../models/group");

const mongoose = require("mongoose");

async function publishExam(req, res){

    const user = req.user;

    if(!user){
        res.status(403).send("Log in to continue.");
        return;
    }

    if(!user.isteacher && !user.isadmin){
        res.status(401).send("This command requires teacher privileges or higher.");
        return;
    }

    const id = mongoose.Types.ObjectId(req.body.id);

    const exam = await Exam.findById(id);

    if(!exam){
        res.status(400).send("Unknown exam id");
        return;
    }

    if(!user.isadmin && exam.owner != user._id){
        res.status(403).send("You don't have ownership of this exam. Admin privileges required.");
        return;
    }

    await Exam.findByIdAndUpdate(id, {
        $set: {
            isPublished: true
        }
    });


    // Add exam to list of exams todo for targeted users.

    for(let uid of exam.targetUsers){
        const u = await User.findById(uid);
        if(!u.examsTodo.includes(id)) u.examsTodo.push(id);
        u.save();
    }

    for(let gid of exam.targetGroups){
        const g = await Group.findById(gid);
        for(let uid of g.users){
            const u = await User.findById(uid);
            if(!u.examsTodo.includes(id)) u.examsTodo.push(id);
            u.save();
        }
    }

    res.status(200).send("Exam published!")


}

module.exports = publishExam;