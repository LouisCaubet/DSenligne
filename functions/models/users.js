const mongoose = require("mongoose");

const UserSchema  = new mongoose.Schema({
    username :{
        type  : String,
        required : true
    },
    password :{
        type  : String,
        required : true
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    isteacher: {
        type: Boolean,
        default: false
    },
    isadmin: {
        type: Boolean,
        default: false
    },
    groups: {
        type: Array,
        default: []
    },
    examsTodo: {
        type: Array,
        default: []
    },
});
  
const User= mongoose.model("User", UserSchema, "users");
  
module.exports = User;