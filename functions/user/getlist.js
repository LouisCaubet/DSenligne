const User = require("../models/users");
const sanitize = require("mongo-sanitize");

const mongoose = require("mongoose");

async function getUserList(req, res){

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
        

        let result = await User.find({
            _id: { $in: ids }
        });

        for(let r of result){
            r.password = undefined;
        }

        // TODO : if user is not admin, remove all users that are not in one of the groups
        //        user has control of.

        res.send(result);
        
        

    }
    else {

        const json = req.query;
        sanitize(json);

        let result = await User.find(JSON.parse(json.filter)).sort([json.sort]);
        const total = result.length;
        result = result.slice(json.range[0], json.range[1]);

        for(let r of result){
            r.password = undefined;
        }

        // TODO : if user is not admin, remove all users that are not in one of the groups
        //        user has control of.

        res.status(200).send({
            data: result,
            total: total
        });

    }

    

}

module.exports = getUserList;