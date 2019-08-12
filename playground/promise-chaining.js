require('../src/db/mongoose')

const User = require('../src/models/user')

// 5d50b72fda098c10e9bd66db

User.findByIdAndUpdate('5d50c15c8909611367d8fd1a', {
    age: 1
}).then((user) => {
    console.log(user)
    return User.countDocuments({ age: 1})
}).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})