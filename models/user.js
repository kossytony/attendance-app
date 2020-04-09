const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Schema} = mongoose;

const userSchema =  Schema({

    email : { 
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: (value)=> {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email Address'})
            }
        }
    },
    password : { 
        type: String,
        required: true,
        minLength: 7,  
    },
    name : {
        type: String, 
        required: true,
        trim: true,
   },
   tokens: [{
       token:{
        type: String,
        required: true,
    },
   }]
})

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
        next();
})

userSchema.methods.generateAuthToken = async function (){
    const user = this;
    const token = jwt.sign({_id : user._id}, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}


userSchema.statics.findByCredentials = async function (email, password) {
    console.log({email, password})
    const user = await User.findOne({email});
    if (!user) {
        throw new Error({error: 'Invalid login credentials'})
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error ({error : 'Incorrect password supplied'});
    }
    return user;
}


const User = mongoose.model('User', userSchema)  
module.exports = User 
