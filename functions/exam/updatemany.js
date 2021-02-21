const Exam = require("../models/exam");

const mongoose = require("mongoose");

async function updateMany(req, res){

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
        ids.push(mongoose.Types.ObjectId(i));
    }

    let set = req.body;
    set.isPublished = undefined;
    set.owner = undefined;

    if(user.isadmin){
        await Exam.updateMany({
            _id: {$in: ids},
            isPublished: false
        }, {
            $set: set
        });
    }
    else {
        await Exam.updateMany({
            _id: {$in: ids},
            owner: user._id,
            isPublished: false
        }, {
            $set: set
        });
    }

    res.status(200).send(nb_ids);

}

module.exports = updateMany;