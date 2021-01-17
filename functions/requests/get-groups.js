const Group = require("./../models/group");
// const mongoose = require("mongoose");

async function getGroups(req, res){

    const user = req.user;

    if(!user){
        res.status(403).send("Log in to continue.");
        return;
    }

    if(!user.isteacher && !user.isadmin){
        res.status(401).send("This command requires teacher privileges or higher.");
        return;
    }

    const groups = await Group.find({
        owners: user._id
    });

    res.status(200).send(groups);

}

module.exports = getGroups;