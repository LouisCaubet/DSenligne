const FilledExam = require("../models/filled-exam");
const Exam = require("../models/exam");
const sanitize = require("mongo-sanitize");

async function getFilledExamList(req, res){

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

        const ids = JSON.parse(sanitize(req.query.ids));
        let result = await FilledExam.find({
            _id: { $in: ids }
        });

        // Remove elements not from the correct owner.
        for(let r of result){
            let owner = (await Exam.findById(r.examId)).owner;
            if(owner != user._id){
                result.splice(result.indexOf(r), 1);
            }
        }

        res.send(result);

    }
    else {

        const sort = JSON.parse(sanitize(req.query.sort));
        const range = JSON.parse(sanitize(req.query.range));
        const filter = JSON.parse(sanitize(req.query.filter));

        const exams = await Exam.find({
            owner: user._id,
            isPublished: true
        });
    
        const ids = exams.map((e) => e._id);

        if(filter.$or){
            filter.$or.push({done: true}, {expiresAt: {$lte: new Date()}})
        }
        else {
            filter.$or = [{done: true}, {expiresAt: {$lte: new Date()}}];
        }

        
        if(user.isadmin){
            // Nothing particular for now
        }
        else if(user.isteacher){
            filter.examId = {$in: ids};
        }

        let result = await Exam.find(filter).sort(sort);
        result = result.slice(range[0], range[1]);
        res.status(200).send(result);

    }

    

}

module.exports = getFilledExamList;