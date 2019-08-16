const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')

router.post('/tasks', auth, async(req,res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body, 
        owner: req.user._id
    })
    console.log(task)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){ 
        res.status(400).send()
    }
    // task.save().then(() => {
    //     res.status(201).send(task)   
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

// GET /tasks?completed=false || true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc

// paginations limit skip
router.get('/tasks', auth, async(req,res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{
        // const tasks = await Task.find({ owner: req.user._id })
        //or
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                // sort: {
                //     // completed: -1
                //     // createdAt: -1 //integer 1, -1 asc or desc
                // }
                sort: sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
        // res.send(tasks)
    }catch(e){
        res.status(500).send()
    }
    // Task.find({

    // }).then((tasks) => {
    //     res.send(tasks)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

// router.get('/tasks/:id', async(req,res)=> {
//     const _id = req.params.id
//     // console.log(_id)
//     try{
//         const task = await Task.findById(_id)
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//     }catch(e){
//         res.status(500).send()
//     }
//     // Task.findById(_id).then((task) => {
//     //     if(!task){
//     //         return res.status(404).send()
//     //     }
//     //     res.send(task)
//     // }).catch((error) => {
//     //     res.status(500).send()
//     // })
// })

router.get('/tasks/:id', auth, async(req,res)=> {
    const _id = req.params.id
    try{
        const task = await Task.findOne({ _id, owner: req.user._id })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }
    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
        // const task = await Task.findById(req.params.id)
        //apply middleware mongoose shortcut
        // updates.forEach((update) => {
        //     task[update] = req.body[update]
        // })
        // await task.save()
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    }catch(error){
        res.status(400).send(error)
    }
})


router.delete('/tasks/:id', auth, async(req,res) => {
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router