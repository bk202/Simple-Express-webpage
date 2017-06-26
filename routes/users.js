var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test_route', function(req, res, next){
	res.send('Testing route');
});

module.exports = router;
