const Exam = require("./../models/exam");

async function getExams(req, res){

    const user = req.user;

    if(!user){
        res.status(401).send("Log in to continue.");
        return;
    }

    if(!user.isteacher && !user.isadmin){
        res.status(403).send("This command requires teacher privileges or higher.");
        return;
    }

    const id = req.query.id;

    const exam = await Exam.findById(id);

    if(!exam || (exam.owner != user._id && !user.isadmin)){
        res.status(403).send("This exam does not exist.");
    }

    res.status(200).send(exam);

}

module.exports = getExams;