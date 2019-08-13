const express = require('express')
const router = new express.Router()
const User = require('../models/user')

// router.get('/test', (req,res) => {
//     res.send('This is from my other route')
// })

router.post('/users', async(req,res) => {
    // res.send('testing')
    // res.send(req.body)
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
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

router.get('/users', async(req,res) => {
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }
    // User.find({

    // }).then((users) => {
    //     res.send(users)
    // }).catch((error) =>{ 
    //     res.status(500).send()
    // })
})

router.get('/users/:id', async(req,res) => {
    //url params
    // console.log(req.params)
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
    
    // User.findById(_id).then((user) => {
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

router.patch('/users/:id', async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) //new returns updated info
        // if(!user){
        //     return res.status(404).send()
        // }
        // res.send(user)
        user ? res.send(user) : res.status(404).send()
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/users/:id', async(req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router