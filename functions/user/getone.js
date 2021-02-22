const User = require("../models/users");

const mongoose = require("mongoose");

async function getUser(req, res){

    const user = req.user;

    if(!user){
        res.status(401).send("Log in to continue.");
        return;
    }

    if(!user.isteacher && !user.isadmin){
        res.status(403).send("This command requires teacher privileges or higher.");
        return;
    }

    const id = req.params.id;

    const result = await User.findById(mongoose.Types.ObjectId(id));

    // TODO: if user is not admin, if res is not in one of the groups user has control of, return null.

    res.status(200).send(result);

}

module.exports = getUser;