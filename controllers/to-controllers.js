const {
    prisma
} = require('../prisma/prisma-client');
const {
    current
} = require('./user-controller');

const ToController = {
    createTo: async (req, res) => {
        const {
            placeNumber,
            address,
            protocol
        } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.user.userId)
            }

        })
        if (!placeNumber) {
            return res.status(400).json({
                error: 'Все поля обязательны'
            })
        }
        try {
            const to = await prisma.to.create({
                data: {
                    placeNumber,
                    fio: `${user.surname} ${user.firstname} ${user.secondname}`,
                    address,
                    protocol
                }
            })
            res.json(to)
        } catch (error) {
            console.log("Create to error")
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    },
    getAllTo: async (req, res) => {
        try {
            const tos = await prisma.to.findMany({
                select: {
                    id: true,
                    placeNumber: true,
                    createdAt: true,
                    fio: true,
                    address: true
                }
            })
            res.json(tos)
        } catch (error) {
            console.error('get all Tos error', error)
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    },
    getToById: async (req, res) => {
        const {
            id
        } = req.params;
        try {
            const to = await prisma.to.findUnique({
                where: {
                    id: Number(id)
                }
            })
            if (!to) {
                return res.status(404).json({
                    error: 'Площадка не найдена'
                })
            }
            res.json(to)
        } catch (error) {
            console.error('get to By Id get error', error)
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    },
    updateTo: async (req, res) => {
        const {
            id
        } = req.params;
        const {
            protocol
        } = req.body;
        try {
            const to = await prisma.to.update({
                where: {
                    id: Number(id)
                },
                data: {
                    protocol: protocol || undefined
                }
            })
            res.json(to)
        } catch {
            console.error("To update error")
            return res.status(500).json({
                error: "Internal server error"
            })
        }
    },
    deleteTo: async (req, res) => {
        const {
            id
        } = req.params;

        const to = await prisma.to.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!to) {
            return res.status(404).json({
                error: 'ТО не найден'
            })
        }
        try {
            const transaction = await prisma.$transaction([
                prisma.to.delete({
                    where: {
                        id: Number(id)
                    }
                })

            ])
            res.json(transaction)
        } catch (error) {
            console.error('Delete to error', error)
            return res.status(500).json({
                error: 'Internal server error'
            })
        }

    },
}

module.exports = ToController;