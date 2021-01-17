const User = require("./../models/users");

// For now, this will return all users.
// When project will be deployed to multiple orgs,
// this should only return the users in the same org.

async function getUsers(req, res){

    const user = req.user;

    if(!user){
        res.status(401).send("Log in to continue.");
        return;
    }

    if(!user.isteacher && !user.isadmin){
        res.status(403).send("This command requires teacher privileges or higher.");
        return;
    }

    const users = await User.find({}, "username firstname lastname", () => {});

    res.status(200).send(users);

}

module.exports = getUsers;