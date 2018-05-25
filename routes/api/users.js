const express = require('express');
const router = express.Router();
const gravator = require('gravatar');
const Users = require('../../models/Users')
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport');

//Load Input Validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')


// @route Get api/users/test
// @desc Tests users route
// @access Public
router.get('/test', (req,res) => res.json({msg:'users Works'}));

router.post('/register',(req,res)=>{
    const {errors,isValid} = validateRegisterInput(req.body);

    //Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    Users.findOne({email:req.body.email})
        .then(user =>{
            if(user)
            {
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            }
            else
            {
                const avatar = gravator.url(req.body.email,{
                    s:'200',
                    r:'pg',
                    d:'mm'
                });
                const newUser = new Users({
                    name:req.body.name,
                    email:req.body.email,
                    avatar,
                    password:req.body.password
                });
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user=>res.json(user))
                        .catch(err=>console.log(err));                       
                    })
                })
            }
        })
})

router.post('/login',(req,res)=>{
   
    const {errors,isValid} = validateLoginInput(req.body);

    //Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    //find user by email
    User.findOne({email})
        .then(user => {
            if(!user)
            {
                errors.email = 'Email not found';
                return res.status(404).json(errors)
            }
            //check password
            bcrypt.compare(password,user.password)
                .then(isMatch => {
                    if(isMatch){
                     //user matched   res.json({msg:'success'});
                     const payload = {id:user.id,name:user.name,avatar:user.avatar}
                     jwt.sign(payload,keys.secretOrkey,
                        {expiresIn:3600},
                        (err,token)=>{
                            res.json({
                                sucess:true,
                                token:'Bearer' + token
                            })
                        });
                    }else{
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors);    
                    }    
                })
        });
});

// @route Get api/users/current
// @desc Return current user
// @access private

router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name: req.user.name
    });
});
module.exports = router;