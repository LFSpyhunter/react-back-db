const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/user-controller');
const authenticateToken = require('../middleware/auth');
const { PlaceController, ToController } = require('../controllers');

const uploadDestination = 'uploads'

//показываем, где хранить файлы
const storage = multer.diskStorage({
    destination: uploadDestination,
    filename: function(req, file, cb) {
        cb(null. file.originalname)
    }
})

const uploads = multer({storage: storage})
//роуты для юзера
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/current', authenticateToken, UserController.current)
router.get('/users/:id', authenticateToken, UserController.getUserById)
router.put('/users/:id', authenticateToken, UserController.updateUser)
//роуты для площадок
router.post('/places', authenticateToken, PlaceController.createPlace)
router.get('/places', authenticateToken, PlaceController.getAllPlace)
router.get('/places/:id', authenticateToken, PlaceController.getPlaceById)
router.delete('/places/:id', authenticateToken, PlaceController.deletePlace)
//роуты для ТО
router.post('/to', authenticateToken, ToController.createTo)
router.get('/to', authenticateToken, ToController.getAllTo)
router.get('/to/:id', authenticateToken, ToController.getToById)
router.put('/to/:id', authenticateToken, ToController.updateTo)
router.delete('/to/:id', authenticateToken, ToController.deleteTo)



module.exports = router;