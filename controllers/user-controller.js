const {
    prisma
} = require('../prisma/prisma-client');
const bcypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');



const UserController = {
    register: async (req, res) => {
        const {
            login,
            surname,
            firstname,
            secondname,
            password
        } = req.body;

        if (!login || !password || !surname || !firstname || !secondname) {
            return res.status(400).json({
                error: "Не все поля заполнены"
            })
        }
        try {
            const existingUser = await prisma.user.findUnique(({
                where: {
                    login
                }
            }));
            if (existingUser) {
                return res.status(400).json({
                    error: "Пользователь уже существует"
                })
            }
            const hashedPassword = await bcypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    login,
                    surname,
                    firstname,
                    secondname,
                    password: hashedPassword
                }
            })
            res.json(user)
        } catch (error) {
            console.error('Error in register')
            return res.status(500).json({
                error: "Internal server error"
            })

        }
    },
    login: async (req, res) => {
        const {
            login,
            password
        } = req.body;
        if (!login || !password) {
            return res.status(400).json({
                error: "Все поля обязательны"
            })
        }
        try {
            const user = await prisma.user.findUnique({
                where: {
                    login
                }
            });
            if (!user) {
                return res.status(400).json({
                    error: "Неверный логин и пароль"
                })
            }
            const valid = await bcypt.compare(password, user.password);
            if (!valid) {
                return res.status(400).json({
                    error: "Неверный логин и пароль"
                })
            }
            const token = jwt.sign(({
                userId: user.id
            }), process.env.SECRET_KEY);
            res.json({
                token
            })

        } catch (error) {
            console.log(error)
            return res.status(400).json({
                error: "Internal server error"
            })
        }
    },
    getUserById: async (req, res) => {
        const {
            id
        } = req.params;
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(id)
                }
            })
            if (!user) {
                return res.status(404).json({
                    error: "Пользователь не найден"
                })
            }
            res.json(user)
        } catch {
            console.error("Get current user error")
            return res.status(500).json({
                error: "Internal server error"
            })
        }

    },
    updateUser: async (req, res) => {
        const {
            id
        } = req.params;
        const {
            surname,
            firstname,
            secondname,
            login
        } = req.body;
        try {
            if (login) {
                const existingUser = await prisma.user.findFirst({
                    where: {
                        login
                    }
                })
                if (existingUser && existingUser.id !== id) {
                    return res.status(400).json({
                        error: "Такой логин уже используется"
                    })
                }
            }
            const user = await prisma.user.update({
                where: {
                    id: Number(id)
                },
                data: {
                    login: login || undefined,
                    surname: surname || undefined,
                    firstname: firstname || undefined,
                    secondname: secondname || undefined
                }
            })
            res.json(user)
        } catch {
            console.error("User update error")
            return res.status(500).json({
                error: "Internal server error"
            })
        }

    },
    current: async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.userId
                }
            })
            if (!user) {
                return res.status(400).json({
                    error: "Не удалось найти пользователя"
                })
            }
            res.json(user)
        } catch {
            console.error("Get current error")
            return res.status(500).json({
                error: "Internal server error"
            })
        }
    },
}

module.exports = UserController;