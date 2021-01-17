const Exam = require("./../models/exam");

async function getExams(req, res){

    const user = req.user;

    if(!user){
        res.status(403).send("Log in to continue.");
        return;
    }

    if(!user.isteacher && !user.isadmin){
        res.status(401).send("This command requires teacher privileges or higher.");
        return;
    }

    const exams = await Exam.find({
        owner: user._id,
        isPublished: false
    });

    res.status(200).send(exams);

}

module.exports = getExams;