const router = require('express').Router();

router.get('/usertest', (req, res) => {
    res.send('user test successful');
});

//post test
router.post('/usertest', (req, res) => {
    return res.send(req.body.username);
});

module.exports = router;
