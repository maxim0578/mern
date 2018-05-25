const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const User =mongoose.model('users');
const keys = require('../config/keys');
const opts = {};
opts.jwtFromRequest =  ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrkey; //had error as k in secretOrKey was in not in caps 
module.exports = passport => {
    passport.use(new jwtStrategy(opts,(jwt_payload,done)=>{
        //console.log(jwt_payload);
        User.findById(jwt_payload.id)
            .then(user =>{
                if(user){
                    return done(null,user);
                }
                return done(null,false);
            })
            .catch(err=>console.log(err));
    })
);
};

//clientid google auth aravind.chandran05
//991106658386-dt230120c4qri8hlldbclmloiai9977p.apps.googleusercontent.com
//public token - we can share this with public

//client secret
//7p7vaN5lp-OvwhJaAcBagSGm
//private token we domt want any one else to see this.




