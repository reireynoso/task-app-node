//CRUD

// const mongodb =  require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'

const databaseName = 'task-manager'

// const id = new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error,client) => {
    if(error){
        return console.log('Unable to connect to database')
    }
    // console.log('Connected')
    const db = client.db(databaseName)

    // db.collection('users').findOne({ _id: new ObjectID("5d4f9244b21e8c18c9c59a10") }, (error, user) => {
    //     if(error){
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(user)
    // })

    //return cursor
    // db.collection('users').find( { age: 29}).toArray((error, users) => {
    //     console.log(users)
    // })

    db.collection('tasks').findOne({_id: new ObjectID("5d4f8ef4f30bff18408feaf1")}, (error, task) => {
        console.log(task)
    })

    db.collection('tasks').find({ completed: false}).toArray((error, tasks) => {
        console.log(tasks)
    })

    // db.collection('users').insertOne({
    //     _id: id,
    //     name: "Vikram",
    //     age: 26
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert user')
    //     }

    //     console.log(result.ops)//array of documents
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: "Jen",
    //         age: 28
    //     },
    //     {
    //         name: "Gunther",
    //         age: 27
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log("Unable to enter documents")
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: "Eat",
    //         completed: false
    //     },
    //     {
    //         description: "Sleep",
    //         completed: false
    //     },
    //     {
    //         description: "Code",
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log("Unable to add tasks")
    //     }

    //     console.log(result.ops)
    // })
})