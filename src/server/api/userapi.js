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

module.exports = router
