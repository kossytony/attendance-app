const express = require('express');
const router = express.Router();
const User = require('../models/User.js');


router.post( '/users', async (req, res)=>{
   try{
       const user = new User(req.body);
       await user.save();
       const token = await user.generateAuthToken();
       res.status(201).send({
            user,
            token
       })
   }
catch (error){

    res.status(400).send(error)

}});

router.post('/login', async (req, res)=>{
    try {
            console.log(req.header)
            const {email, password} = req.body;
            
             const user = await User.findByCredentials(email,password);
            if (!user) {
                res.status(400).send({
                    error: 'Please do check login credentials'
                })
            }
            const token = await user.generateAuthToken()
            res.status(200).send({user, token})
    }
    catch(error){
        res.status(400).send(error)
    }
})

router.post('/logout', async (req, res)=> {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
       await req.user.save()
       res.send()
    }
    catch(error) {
        res.status(500).send({error})
    }
})

router.post('/logoutall', async (req,res)=> {
        try{
            req.user.tokens.splice(0, req.user.tokens.length)
            await req.user.save()
            res.send()
        }
        catch (error){
            res.status(500).send(error)
        }
})

module.exports = router;