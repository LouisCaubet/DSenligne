const bcrypt = require("bcrypt")
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/users")

passport.serializeUser(function(user, done){
    done(null, user._id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    })
})

passport.use(new LocalStrategy(
  function(username, password, done) {

    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log("Incorrect username");
        return done(null, false, { message: "Incorrect username." });
      }

      return bcrypt.compare(password, user.password).then((result) => {
        if(result){
            return done(null, user);
        }
        else {
            return done(null, false, { message: "Incorrect password." })
        }
      }).catch((err) => console.log(err));

    });
  }
));

module.exports = passport;