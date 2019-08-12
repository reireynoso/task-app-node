const mongoose = require('mongoose')
// const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false //addressed deprecation warning
})

// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error("Email is invalid format")
//             }
//         }
//     },
//     password: {
//         type: String,
//         trim: true,
//         minlength: 7,
//         validate(value){
//             if(value.includes("password")){
//                 throw new Error("Password cannot contain password")
//             }
//         }
//     } , 
//     age: {
//         type: Number,
//         default: 0,
//         validate(value){
//             if(value < 0){
//                 throw new Error('Age must be positive number')
//             }
//         }
//     }
// })

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const code = new Task({
//     description: "probably gonna delete this for practice",
//     completed: false
// })

// code.save().then(() => {
//     console.log(code)
// }).catch((error) => {
//     console.log(error)
// })

// const me = new User({
//     name: '  Reinald',
//     email: "rei@microsoft.edu",
//     password: "super"
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })

