import express from 'express'
import mongoose from 'mongoose'
import { registerValidation, loginValidation } from './validations/auth.js'
import checkAuth from './utils/checkAuth.js'
import { register, login, getMe } from './controllers/UserController.js'
import {
    create,
    getAll,
    getOne,
    remove,
    update,
} from './controllers/PostController.js'
import { postCreateValidation } from './validations/post.js'
import multer from 'multer'
import handleValidationErrors from './utils/handleValidationErrors.js'

mongoose
    .connect(
        'mongodb+srv://minus:qqqqqq@cluster0.3zcquqg.mongodb.net/blog?retryWrites=true&w=majority'
    )
    .catch((err) => {
        console.log('DB ERROR', err)
    })

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/')

// AUTH
app.get('/auth/me', checkAuth, getMe)
app.post('/auth/login', handleValidationErrors, loginValidation, login)
app.post('/auth/register', handleValidationErrors, registerValidation, register)

// POSTS
app.get('/posts', getAll)
app.get('/posts/:id', getOne)
app.post(
    '/posts',
    checkAuth,
    handleValidationErrors,
    postCreateValidation,
    create
)
app.patch(
    '/posts/:id',
    checkAuth,
    handleValidationErrors,
    postCreateValidation,
    update
)
app.delete('/posts/:id', checkAuth, remove)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
})
