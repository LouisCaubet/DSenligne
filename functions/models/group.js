const mongoose = require("mongoose");

/* 
 * A Group represents a group of users (class, etc)
 * It can be accessed by all accounts in owners.
 * Owners must have privileges teacher or higher.
 * A User can know what groups he's part of, but not its
 * other members.
 * 
*/

const GroupSchema  = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    
    users: {
        type: Array,
        default: []
    },

    owners: {
        type: Array,
        default: []
    }

});
  
const Group = mongoose.model("Group", GroupSchema, "groups");
  
module.exports = Group;