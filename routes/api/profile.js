const express=require('express');
const router= express.Router();
const mongoose=require('mongoose');
const passport=require('passport');
const profile = require('../../models/profile');
const { off } = require('../../models/profile');

//load profile model
const Profile=require("../../models/profile");

//load profile User
const User=require("../../models/User");


//@route   get api/profile/test
//@desc    test profile route
//@access  public
router.get('/test',(req,res)=>res.json({msg:'profile works'}));

//@route   get api/profile
//@desc    get currnt user profile
//@access  private
router.get('/',passport.authenticate('jwt', {session:false}),(req,res)=>{
  const errors={};
    profile.findOne({user:req.user.id})
  .then(profile=>{ 
      if(!profile){
            errors.noprofile='there is no profile for this user '
          return res.status(404).json(errors)
      }
      res.json(profile);
  })
  .catch(err=>res.status(404).json(err)); 
});
module.exports=router;