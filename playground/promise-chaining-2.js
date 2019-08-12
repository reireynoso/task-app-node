require('../src/db/mongoose')

const Task = require('../src/models/task')

// 5d50b72fda098c10e9bd66db

// Task.findByIdAndDelete('5d5197f905b91109abfbca1e', {
//     age: 1
// }).then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false})
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

//5d51b4ba2b7294122308183f
const deleteTaskAndCount = async(id, completed) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed })
    return count
}


deleteTaskAndCount('5d51b4ba2b7294122308183f', false).then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})