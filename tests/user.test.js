const request = require('supertest')
// const jwt = require('jsonwebtoken')
// const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)
// const userOneId = new mongoose.Types.ObjectId()
// const userOne = {
//     _id: userOneId,
//     name: 'Kring',
//     email: 'kring@example.com',
//     password: 'hello123',
//     tokens: [{
//         token: jwt.sign({_id: userOneId}, process.env.SECRET_JWT)
//     }]
// }

// beforeEach(async() => {
//     // await User.deleteMany()
//     // await new User(userOne).save()
// })


test('Should sign up new user', async() => {
    const response = await request(app).post('/users').send({
        name: 'Rei',
        email: 'rei@example.com',
        password: 'hello123'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    // console.log(user)
    // expect(response.body.token).toBe(user.tokens[0].token)
    //Assertions about the response 
    // expect(response.body.user.name).toBe('Rei')

    expect(response.body).toMatchObject({
        user: {
            name: 'Rei',
            email: 'rei@example.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('hello123')
})

test('Should login existing user', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'shouldbewrong'
    }).expect(400)
})

test('Should get profile for user', async() => {
    //request headers
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async() => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async() =>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer)) //checks properties on objects
})

test('Should update valid user fields', async() =>{
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Super Rei'
        })
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Super Rei')
})

test('Should not update invalid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(400)
})