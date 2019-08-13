const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use(userRouter)
app.use(taskRouter)
// // 1. create new router to compress files
// const router = new express.Router()
// // 2. setup routes
// router.get('/test', (req,res) => {
//     res.send('This is from my other route')
// })
// // 3. register those routes
// app.use(router)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})