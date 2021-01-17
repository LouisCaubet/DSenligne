const Group = require("./../models/group");
const mongoose = require("mongoose");

async function editGroup(req, res){

    const user = req.user;

    if(!user){
        res.status(401).send("Log in to continue.");
        return;
    }

    if(!user.isteacher && !user.isadmin){
        res.status(403).send("This command requires teacher privileges or higher.");
        return;
    }

    const id = mongoose.Types.ObjectId(req.body.id);
    const name = req.body.name;
    const users = req.body.users.map((id) => mongoose.Types.ObjectId(id));

    const group = await Group.findById(id);

    if(!group){
        res.status(400).send("Unknown group");
        return;
    }

    if(!name){
        res.status(400).send("name required");
        return;
    }

    if(!group.owners.includes(user._id) && !user.isadmin){
        res.status(403).send("Only owners can edit groups.");
        return;
    }

    group.name = name;
    group.users = users;
    await group.save();

    res.status(200).send("Changes saved.");

}

module.exports = editGroup;