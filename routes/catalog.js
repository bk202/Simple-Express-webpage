 var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');



router.get('/', user_controller.index);

router.get('/user/create', user_controller.user_create_get);

router.post('/user/create', user_controller.user_create_post);

router.get("/users/:id/delete", user_controller.user_delete_get);

router.post('/users/:id/delete', user_controller.user_delete_post);

router.get('/users/:id/update', user_controller.user_update_get);

router.post('/users/:id/update', user_controller.user_update_post);

// GET request for one user
router.get('/users/:id', user_controller.user_detail);

// GET request for all users
router.get('/users', user_controller.user_list);

module.exports = router;

