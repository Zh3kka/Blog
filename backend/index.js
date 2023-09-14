import express from 'express'
import mongoose, { get } from 'mongoose'
import { registerValidation } from './validations/auth.js'
import checkAuth from './utils/checkAuth.js'
import { register, login, getMe } from './controllers/UserController.js'

mongoose
    .connect(
        'mongodb+srv://minus:qqqqqq@cluster0.3zcquqg.mongodb.net/blog?retryWrites=true&w=majority'
    )
    .catch((err) => {
        console.log('DB ERROR', err)
    })

const app = express()

app.use(express.json())

app.post('/auth/login', login)

app.post('/auth/register', registerValidation, register)

app.get('/auth/me', checkAuth, getMe)

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Все ок',
    })
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})
