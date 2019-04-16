const GoogleStratergy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Load User Model
const User = mongoose.model('users');

module.exports = passport => {
    passport.use(
        new GoogleStratergy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "/auth/google/callback",
            proxy:true
        }, (accessToken, refreshToken, profile, done) => {
            // console.log(accessToken);
            // console.log(profile);

            const image = profile.photos[0].value;
            console.log(image);

            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: image
            }

            User.findOne({
                googleID: profile.id
            }).then(user => {
                if(user){
                    // return user
                    done(null, user);
                }else{
                    // Create User
                    new User(newUser)
                        .save()
                        .then(user => {
                            done(null, user);
                        })
                }
            });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => {
            done(null, user);
        });
    });
}