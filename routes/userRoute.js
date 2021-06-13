const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");
const checkController = require("../controllers/checkController");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
});
const upload = multer({
    storage: storage, fileFilter: (req, file, cb) => {
        if (file.mimetype.split('/')[1] === 'jpeg' || file.mimetype.split('/')[1] === 'jpg' || file.mimetype.split('/')[1] === 'png') {
            cb(null, true);
        } else {
            cb(new Error('this file is not a photo'));
        }
    }
});
router.get('/by-user', checkController.protect, userController.getProFileUser);

router.get('/gardener', checkController.protect, checkController.checkAdminRole, userController.getGardenerProFile);

router.get('/search', checkController.protect, checkController.checkAdminRole, userController.getSearchProFileUser);

router.get('/:status', checkController.protect, checkController.checkAdminRole, userController.getAllProFileUser);

router.post('/upload', upload.single('image'), async (req, res, next) => {
    try {
        const secure_url = await cloudinary.uploader.upload(req.file.path, (err, result) => {
            if (err) return next(err);
            fs.unlinkSync(req.file.path);
            return result.secure_url
        });
        res.status(200).json({ secure_url });
    } catch (err) {
        next(err);
    }

});
//ใช้สำหรับสมัคร admin ครั้งแรกเพียงครั้งเดียวเท่านั้น
router.post('/register-admin', userController.register);

router.post('/register', checkController.protect, checkController.checkAdminRole, userController.register);

router.post('/login', userController.login);

router.patch('/change-password', checkController.protect, userController.changePassword);

router.patch('/:id', checkController.protect, checkController.checkAdminRole, userController.updateStatus);

router.put('/:id', checkController.protect, checkController.checkAdminRole, userController.editProFileUser);

module.exports = router;