const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

//Load profile model
const Profile = require('../../models/Profile');
//Load User Profile
const user = require('../../models/Users');

// @route Get api/profile/test
// @desc Tests profile route
// @access Public
router.get('/test', (req,res) => res.json({msg:'profile Works'}));

// @route Get api/profile
// @desc Get current users profile
// @access private
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors ={};
    Profile.findOne({user:req.user.id})
    .populate('user',['name','avatar','email'])
    .then(profile =>{
        if(!profile){
            errors.noprofile = 'There is no profile for this Id'
            return res.status(404).json(errors)
        }
        res.json(profile);
    })
    .catch(err=>res.status(404).json(err));
});

// @route   POST api/profile/handle/:handle
// @desc    Create or edit user profile
// @access  Private

router.get('/handle/:handle',(req,res)=>{
    const errors ={};
    Profile.findOne({handle:req.params.handle})
    .populate('user',['name','email'])
    .then(profile => {
        if(!profile){
            errors.noprofile = 'There is no profile for this handle'
            return res.status(404).json(errors)
        }
        res.json(profile);
    })
    .catch(err=> res.status(404).json(err));
});

// @route   POST api/user/:user_id
// @desc    Create or edit user profile
// @access  Private
router.get('/user/:user_id',(req,res)=>{
    const errors ={};
    Profile.findOne({user:req.params.user_id})
    .populate('user',['name','email'])
    .then(profile => {
        if(!profile){
            errors.noprofile = 'There is no profile for this userid'
            return res.status(404).json(errors)
        }
        res.json(profile);
    })
    .catch(err=> res.status(404).json({profile:'There is no profile for this userid'}));
});

// @route   POST api/profile/all
// @desc    Create or edit user profile
// @access  Private
router.get('/all',(req,res)=>{
    const errors ={};
    Profile.find()
    .populate('user',['name','email'])
    .then(profile => {
        if(!profile){
            errors.noprofile = 'There is no profile found'
            return res.status(404).json(errors)
        }
        res.json(profile);
    })
    .catch(err=> res.status(404).json({profile:'There is no profile found'}));
});



// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const { errors, isValid } = validateProfileInput(req.body);
  
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }
  
      // Get fields
      const profileFields = {};
      profileFields.user = req.user.id;
      if (req.body.handle) profileFields.handle = req.body.handle;
      if (req.body.company) profileFields.company = req.body.company;
      if (req.body.website) profileFields.website = req.body.website;
      if (req.body.location) profileFields.location = req.body.location;
      if (req.body.bio) profileFields.bio = req.body.bio;
      if (req.body.status) profileFields.status = req.body.status;
      if (req.body.githubusername)
        profileFields.githubusername = req.body.githubusername;
      // Skills - Spilt into array
      if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
      }
  
      // Social
      profileFields.social = {};
      if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
      if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
      if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
      if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
      if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  
      Profile.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
          // Update
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          ).then(profile => res.json(profile));
        } else {
          // Create
  
          // Check if handle exists
          Profile.findOne({ handle: profileFields.handle }).then(profile => {
            if (profile) {
              errors.handle = 'That handle already exists';
              res.status(400).json(errors);
            }
  
            // Save Profile
            new Profile(profileFields).save().then(profile => res.json(profile));
          });
        }
      });
    }
  );

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private

router.post('/experience',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const { errors, isValid } = validateExperienceInput(req.body);
  
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }
    Profile.findOne({user:req.user.id})
    .then(profile =>{
        const newExp = {
            title:req.body.title,
            company:req.body.company,
            location:req.body.location,
            from:req.body.from,
            to:req.body.to,
            current:req.body.current,
            description:req.body.description
        }
            //Add to axp Arry
            profile.experience.unshift(newExp);
            profile.save().then(profile =>res.json(profile));        
    })
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private

router.post('/education',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const { errors, isValid } = validateEducationInput(req.body);
  
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }
    Profile.findOne({user:req.user.id})
    .then(profile =>{
        const newEdu = {
            school:req.body.school,
            degree:req.body.degree,
            fieldofstudy:req.body.fieldofstudy,
            from:req.body.from,
            to:req.body.to,
            current:req.body.current,
            description:req.body.description
        }
            //Add to axp Arry
            profile.education.unshift(newEdu);
            profile.save().then(profile =>res.json(profile));        
    })
});

// @route   DELTE api/profile/experience/:exp_id
// @desc    Delete  experience from  profile
// @access  Private

router.post('/experience/:exp_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const { errors, isValid } = validateEducationInput(req.body);
    
    Profile.findOne({user:req.user.id})
    .then(profile =>{
        //Get remove index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

            //splice out of array
            profile.experience.splice(removeIndex,1);

            //save
            profile.save().then(profile =>res.json(profile));
    })
    .catch(err=> res.status(404).json(err));
});

module.exports = router;

// var hello = {
//     hello: 'world',
//     foo: 'bar'
// };
// var qaz = {
//     hello: 'stevie',
//     foo: 'baz'
// }
// var vas = {
//     hello: 'srinath',
//     foo: 'maz'
// }
// var myArray = [];
// myArray.push(hello,qaz,vas);
// 
// pos = myArray.map(e => e.foo)
// (3) ["bar", "baz", "baz"]
//pos = myArray.map(e => e.hello).indexOf('world');
// 0
//pos = myArray.map(e => e.hello).indexOf('srinath');
// 1