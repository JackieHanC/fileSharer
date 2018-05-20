var express = require('express')

var router = express.Router()

router.use('/searchUser', function(req, res) {
    res.json({
        data: {
            userName: '123',
            pwd: '111'
        }
    })
})

router.use('/checkUserExistence', function (req, res) {
    res.json({
        code: 0
    })
    
})

router.use('/sendMailCode', function (req, res) {
    res.json({
        'codeSent': "naive"
    })
})
module.exports = router
