const multer = require('multer')

let imgObj = {}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        req.url === '/add' ? cb(null, './img/courses') : null
        req.url === '/profile' ? cb(null, './img/profile') : null
        req.url === '/admin/user/add' ? cb(null, './img/profile') : null
        req.url === '/admin/course/add' ? cb(null, './img/courses') : null
        req.url === '/admin/slider/add' ? cb(null, './img/slider') : null
    },
    filename: (req, file, cb) => {
        imgObj = {...file}
        imgObj.date = Date.now()
        imgObj.fullname = imgObj.date + '_' + imgObj.originalname
        cb(null, imgObj.fullname)
    }
  })

  const allowedFilter = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/pjpeg']


  const fileFilter = (req, file, cb) => {
    if(allowedFilter.includes(file.mimetype)){
        cb(null, true)
    } else {
        cb(null, false)
    }
  }

  module.exports = multer({storage, fileFilter})