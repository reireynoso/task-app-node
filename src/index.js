const app = require('./app')

// const express = require('express')
// require('./db/mongoose')
// const User = require('./models/user')
// const Task = require('./models/task')
// const userRouter = require('./routers/user')
// const taskRouter = require('./routers/task')

// const app = express()
const port = process.env.PORT

// const multer = require('multer')
// //multer file upload
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000 //1mb
//     },
//     fileFilter(req,file,cb){ //function, cb=> callback
//         // if(!file.originalname.endsWith('.pdf')){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload Word Doc'))
//         }
//         cb(undefined, true)
//         // cb(new Error('File must be a PDF')) //3 ways to cb
//         // cb(undefined, true)
//         // cb(undefined, false)
//     }
// })

// const errorMiddleware = (req,res,next) => {
//     throw new Error('From my middleware')
// }

// app.post('/upload', upload.single('upload') ,(req,res) => {
//     res.send()
// }, (error, req,res, next) => {
//     res.status(400).send({ error: error.message})//second argument handles any errors from middleware
// })

//new middleware, customize server for our needs
// app.use((req,res,next) => {
//     if(req.method === "GET"){
//         res.send('Get requests are disabled')
//     }
//     else{
//         next()
//     }
// })

// app.use((req,res,next) => {
//     res.status(503).send('Maintenance')
// })

// app.use(express.json())

// app.use(userRouter)
// app.use(taskRouter)
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

// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const myFunction = async () => {
    // const token = jwt.sign({ _id: 'abc123'}, 'thisismynewcourse', {expiresIn: '7 days'})// two args object, string(secret random secret of characters)
    // console.log(token)

    //verify token

    // const data = jwt.verify(token, 'thisismynewcourse')// two args, token w/ secret
    // console.log(data)
    // const password = 'hello'
    // const hashedPassword = await bcrypt.hash(password, 8) //password , rounds 
    // console.log(password)
    // console.log(hashedPassword)

    // const isMatch = await bcrypt.compare('hello', hashedPassword)
    // console.log(isMatch)
// }

// myFunction()

//populate 

// const main = async () => {
//     // const task = await Task.findById('5d543710aaedfc07ba9c1831')
//     // await task.populate('owner').execPopulate() //returns whole object associated with owner
//     // console.log(task.owner)

//     const user = await User.findById('5d5435348006af0728f688d1')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()