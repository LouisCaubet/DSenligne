const Exam = require("../models/exam");
const sanitize = require("mongo-sanitize");

const mongoose = require("mongoose");

async function getExamList(req, res){

    const user = req.user;
    if(!user){
        res.status(401).send("Log in to continue");
        return;
    }

    if(!user.isadmin && !user.isteacher){
        res.status(403).send("Forbidden");
        return;
    }

    if(req.query.ids){

        const nb_ids = JSON.parse(sanitize(req.query.ids));
        const ids = nb_ids.map((i) => mongoose.Types.ObjectId(i));
        
        if(user.isadmin){
            let result = await Exam.find({
                _id: { $in: ids }
            });
    
            res.send(result);
        }
        else {
            let result = await Exam.find({
                _id: { $in: ids },
                owner: user._id
            });
    
            res.send(result);
        }
        

    }
    else {

        const sort = JSON.parse(sanitize(req.query.sort));
        const range = JSON.parse(sanitize(req.query.range));
        const filter = JSON.parse(sanitize(req.query.filter));

        if(user.isadmin){
            // Nothing particular for now
        }
        else if(user.isteacher){
            filter.owner = user._id;
        }

        let result = await Exam.find(filter).sort(sort);
        result = result.slice(range[0], range[1]);
        res.status(200).send(result);

    }

    

}

module.exports = getExamList;