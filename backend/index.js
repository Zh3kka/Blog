import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { registerValidation } from './validations/auth.js'
import { validationResult } from 'express-validator'
import UserModel from './models/User.js'
mongoose
    .connect(
        'mongodb+srv://minus:qqqqqq@cluster0.3zcquqg.mongodb.net/blog?retryWrites=true&w=majority'
    )
    .catch((err) => {
        console.log('DB ERROR', err)
    })

const app = express()

app.use(express.json())

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hashPassword,
        })

        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '15d',
            }
        )

        const { passwordHash, ...userData } = user._doc

        res.json({ ...userData, token })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        })
    }
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})
