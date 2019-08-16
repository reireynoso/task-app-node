const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const {sendWelcomeEmail, sendGoodbyeEmail} = require('../emails/account')
const multer = require('multer')
//multer file upload
// const upload = multer({
//     dest: 'images'
// })

// router.get('/test', (req,res) => {
//     res.send('This is from my other route')
// })

router.post('/users', async(req,res) => {
    // res.send('testing')
    // res.send(req.body)
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send(error)
    //     // console.log(error)
    //     // res.send(error)
    // })
})

const upload = multer({
    // dest: 'images',
    limits: {
        fileSize: 1000000 //1mb
    },
    fileFilter(req,file,cb){ //function, cb=> callback
        // if(!file.originalname.endsWith('.pdf')){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload Jpg Jpeg or Png file'))
        }
        cb(undefined, true)
        // cb(new Error('File must be a PDF')) //3 ways to cb
        // cb(undefined, true)
        // cb(undefined, false)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req,res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    // req.user.avatar = req.file.buffer
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req,res, next) => {
    res.status(400).send({ error: error.message})//second argument handles any errors from middleware
})

router.delete('/users/me/avatar', auth, async(req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async(req,res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

router.post('/users/login', async(req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})
//logging users out 
router.post('/users/logout', auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
//logging all sessions out
router.post('/users/logoutAll', auth, async(req,res) => {
    // console.log(req)
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//auth for url path
router.get('/users/me', auth ,async(req,res) => {
    res.send(req.user)
    // try{
    //     const users = await User.find({})
    //     res.send(users)
    // }catch(e){
    //     res.status(500).send()
    // }
    // User.find({

    // }).then((users) => {
    //     res.send(users)
    // }).catch((error) =>{ 
    //     res.status(500).send()
    // })
})

// router.get('/users/:id', async(req,res) => {
//     //url params
//     // console.log(req.params)
//     const _id = req.params.id
//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send()
//     }
    
    // User.findById(_id).then((user) => {
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
// })

// router.patch('/users/:id', async(req,res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => {
//         return allowedUpdates.includes(update)
//     })
//     if(!isValidOperation){
//         return res.status(400).send({error: 'Invalid updates!'})
//     }
//     try{
//         const user = await User.findById(req.params.id)
//         //apply middleware mongoose shortcut
//         updates.forEach((update) => {
//             user[update] = req.body[update]
//         })
//         await user.save()
//         // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) //new returns updated info
//         // if(!user){
//         //     return res.status(404).send()
//         // }
//         // res.send(user)
//         user ? res.send(user) : res.status(404).send()
//     }catch(error){
//         res.status(400).send(error)
//     }
// })

router.patch('/users/me', auth, async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try{
        // const user = await User.findById(req.params.id)
        //apply middleware mongoose shortcut
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) //new returns updated info
        // if(!user){
        //     return res.status(404).send()
        // }
        // res.send(user)
        // user ? res.send(user) : res.status(404).send()
        res.send(req.user)
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async(req,res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendGoodbyeEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router