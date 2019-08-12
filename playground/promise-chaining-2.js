require('../src/db/mongoose')

const Task = require('../src/models/task')

// 5d50b72fda098c10e9bd66db

Task.findByIdAndDelete('5d5197f905b91109abfbca1e', {
    age: 1
}).then((task) => {
    console.log(task)
    return Task.countDocuments({ completed: false})
}).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})