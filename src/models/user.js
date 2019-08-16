const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid format")
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.includes("password")){
                throw new Error("Password cannot contain password")
            }
        }
    } , 
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be positive number')
            }
        }
    },
    //track tokens 
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

//virtual property relationship between user and task models
userSchema.virtual('tasks', {
    ref : 'Task',
    localField: '_id', //field being associated
    foreignField: 'owner' //foreign key on other model
})
//private methods
userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function (){
    const user = this
    // const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_JWT)

    user.tokens = user.tokens.concat({ token: token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({
        email: email
    })
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

//hash the plain text password before saving
userSchema.pre('save',async function(next){
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    console.log('just before saving')

    next()
})

//Delete user tasks when user is removed

userSchema.pre('remove', async function (next){
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User