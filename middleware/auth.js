const User = require('../models/user');
const jwt = require('jsonwebtoken');

async function auth (req, res, next) {

    const token = req.header('Authentication').replace('Bearer','')
    const data = jwt.verify(token, process.env.JWT)
    try {
        const user = await User.findOne({_id : data._id, 'tokens.token' : token} )
        if (!user)
        {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    }
    catch(error){
        res.status(401).send({error: 'Not authorized to use this resource'})
    }

}