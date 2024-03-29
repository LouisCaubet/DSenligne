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

        const json = req.query;
        sanitize(json);

        if(user.isadmin){
            // Nothing particular for now
        }
        else if(user.isteacher){
            json.filter.owner = user._id;
        }

        let result = await Exam.find(JSON.parse(json.filter)).sort([json.sort]);
        const total = result.length;
        result = result.slice(json.range[0], json.range[1]);
        res.status(200).send({
            data: result,
            total: total
        });

    }

    

}

module.exports = getExamList;