const Group = require("./../models/group");


async function createGroup(req, res){

    const user = req.user;

    if(!user){
        res.status(403).send("Log in to continue.");
        return;
    }

    if(!user.isteacher && !user.isadmin){
        res.status(401).send("This command requires teacher privileges or higher.");
        return;
    }

    const name = req.body.name;

    if(!name){
        res.status(400).send("Name required");
    }

    const group = new Group({
        name: name,
        owners: [user._id]
    });

    await group.save();

    res.status(200).send(group._id);

}

module.exports = createGroup;