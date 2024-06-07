const {
    prisma
} = require('../prisma/prisma-client')

const PlaceController = {
    createPlace: async (req, res) => {
        const {
            number,
            address
        } = req.body;

        if (!number || !address) {
            return res.status(400).json({
                error: 'Все поля обязательны'
            })
        }
        try {
            const place = await prisma.place.create({
                data: {
                    number,
                    address
                }
            })
            res.json(place)
        } catch (error) {
            console.log("Create place error")
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    },
    getAllPlace: async (req, res) => {
        try {
            const places = await prisma.place.findMany({
                select: {
                    id: true,
                    number: true,
                    address: true,
                }
            })
            res.json(places)
        } catch (error) {
            console.error('get all places error', error)
            return res.status(500).json({
                error: 'Internal server error'
            })
        }

    },
    getPlaceById: async (req, res) => {
        const {
            id
        } = req.params;
        try {
            const place = await prisma.place.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    to: true,
                    defect: true,
                }
            })
            if (!place) {
                return res.status(404).json({
                    error: 'Площадка не найдена'
                })
            }
            res.json(place)
        } catch (error) {
            console.error('get Place By Id get error', error)
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    },
    deletePlace: async (req, res) => {
        const {
            id
        } = req.params;

        const place = await prisma.place.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!place) {
            return res.status(404).json({
                error: 'Площадка не найдена'
            })
        }
        try {
            const transaction = await prisma.$transaction([
                prisma.to.deleteMany({
                    where: {
                        placeNumber: place.number
                    }
                }),
                prisma.defect.deleteMany({
                    where: {
                        placeNumber: place.number
                    }
                }),
                prisma.place.delete({
                    where: {
                        id: Number(id)
                    }
                })

            ])
            res.json(transaction)
        } catch (error) {
            console.error('Delete place error', error)
            return res.status(500).json({
                error: 'Internal server error'
            })
        }

    }
}

module.exports = PlaceController