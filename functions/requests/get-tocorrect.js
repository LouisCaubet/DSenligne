const FilledExam = require("./../models/filled-exam");
const Exam = require("./../models/exam");

async function getExamsToCorrect(req, res){

    const user = req.user;

    if(!user){
        res.status(401).send("Log in to continue.");
        return;
    }

    if(!user.isteacher && !user.isadmin){
        res.status(403).send("This command requires teacher privileges or higher.");
        return;
    }

    const exams = await Exam.find({
        owner: user._id,
        isPublished: true
    });

    const ids = exams.map((e) => e._id);

    const tocorrect = await FilledExam.find({
        examId: {$in: ids},
        corrected: false,
        $or: [{done: true}, {expiresAt: {$lte: new Date()}}]
    });

    res.status(200).send(tocorrect);

}

module.exports = getExamsToCorrect;