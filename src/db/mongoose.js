const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
})

const Task = mongoose.model('Task', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
})

const code = new Task({
    description: "Going to watch some videos and maybe code",
    completed: false
})

code.save().then(() => {
    console.log(code)
}).catch((error) => {
    console.log(error)
})

// const me = new User({
//     name: 'Rei',
//     age: 29
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })

