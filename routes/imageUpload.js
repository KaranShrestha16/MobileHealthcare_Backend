const express = require('express');
const multer = require('multer');
const path = require('path');
const uploadRouter = express.Router();
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './images',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage')


// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);


    if (mimetype && extname) {
        cb('You can upload only image files!');
        // return cb(null, true);
    } else {
        // cb('You can upload only image files!');
        return cb(null, true);
    }
}

uploadRouter.post('/imageUpload', (req, res) => {
    console.log(req.file);
    upload(req, res, (error) => {
        if (error) {
            console.log(error)
            res.status(400).json({
                success: false,
                error: error
            })
        } else {
            if (req.file == undefined) {
                res.status(400).json({
                    success: false,
                    message: "No File Selected!"
                });
            } else {
                console.log(req.file);
                res.json({ fileName: req.file.filename });
            }



        }
    });
});
module.exports = uploadRouter;
