const bcrypt = require("bcrypt")
const User = require("./../models/users")

async function register(req, res){

    const username = req.body.username;
    const password = req.body.password;
    const confirm = req.body.confirm;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    // Check username does not already exist.
    const existing = await User.find({
        username: username
    });

    if(existing.length > 0){
        res.status(400).send("Username already used.");
        return;
    }

    if(password !== confirm){
        res.status(400).send("Both passwords are not equal.");
        return;
    }

    const user = new User({
        username: username, 
        password: "",
        firstname: firstname,
        lastname: lastname,
        isadmin: false
    })

    // Compute password hash
    try {

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        user.password = hash;
        await user.save();

        await req.login(user, (err) =>{
            if(err) throw err;
        });

        res.status(200).send("Successfully registered.");

    }
    catch(e){
        console.log(e);
        res.status(500).send("Internal server error. Please try again.");
    }
    

}

module.exports = register;