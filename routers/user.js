const express = require('express')
const User = require('../model/user')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      User.findOne({email:req.body.email}).then(user1=>{
        if(user1){
          return res.status(401).json({
            message: "User Already Exist"
          })
        }

        user.save().then(result => {
          if(!result){
            return res.status(500).json({
              message: "Error Creating USer"
            })
          }
          res.status(201).json({
            message: "User created!",
            result: result
          });
      })
        })   
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });;
    })
   
  });


  router.post("/login", (req, res, next) => {
    let fetchedUser;
  
    User.findOne({email:req.body.email}).then(user=>{
      if(!user){
        return res.status(401).json({
          message: "Auth failed no such user"
        })
      }
      fetchedUser=user;
      return bcrypt.compare(req.body.password, user.password);
    }).then(result=>{
      console.log(fetchedUser)
      if(!result){
        return res.status(401).json({
          message: "Auth failed inccorect password"
        })
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "ea92f3b7bfbad210ab9d5cf948f185ecc963d632c99538ecfa1ac231c7541fe3907527895e9d856ce5e4286e2e20ea979bca1f251bb81b784e757579313f2dd5",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(e=>{
     
      console.log(e)
    
    })
  })
module.exports = router