import { body } from 'express-validator'

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содеражть минимум 5 символов').isLength({
        min: 5,
    }),
    body('fullName', 'Укажите Ваше имя').isLength({ min: 2 }),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
]

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содеражть минимум 5 символов').isLength({
        min: 5,
    }),
]
