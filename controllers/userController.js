var User = require('../models/users');

var async = require('async');

exports.index = function(req, res){
	async.parallel({
		user_count: function(callback){
			User.count(callback);
		}
	}, function(err, results){
		res.render('user_count', {title: 'Local library home', err, data: results});
	});
};

exports.user_list = function(req, res){
	User.find({}, 'username email')
	.populate('users')
	.exec(function(err, list_users){
		if(err) {
			console.log(err);
			return;
		}
		res.render('user_list', {title: 'User List', user_list: list_users});
	});
};

exports.user_detail = function(req, res){
	User.findById(req.params.id)
	.exec(function(err, user_instance){
		if(err){
			console.log(err);
			return;
		}
		res.render('user_detail', {title: 'User', user: user_instance});
	});

};

exports.user_create_get = function(req, res){
	res.render('user_create_form', { title: 'Create new user' });
}

exports.user_create_post = function(req, res){
	req.checkBody('Username', 'Username cannot be empty').notEmpty();
	req.checkBody('Password', 'Password cannot be empty').notEmpty();
	req.checkBody('Email', 'Email cannot be empty').notEmpty();

	req.sanitize('username').escape();
	req.sanitize('username').trim();

	var Errors = req.validationErrors();

	var user = new User({username : req.body.Username, password : req.body.Password, email: req.body.Email});

	if(Errors){
		console.log('validation error');
		res.render('user_create_form', {title: 'Create new user', user: user, errors: Errors});
		return;
	}

	else{
		User.findOne({'username': req.body.Username})
		.exec(function(err, found_user){
			console.log('found_user: ' + found_user);
			if(err) {
				console.log(err);
				return;
			}

			if(found_user){
				res.redirect(found_user.url);
			}
			else{
				user.save(function(err){
					if(err){
						console.log(err);
						return;
					}

					res.redirect(user.url);
				});
			}
		});
	}

};

exports.user_delete_get = function(req, res){
	User.findById(req.params.id).exec(function(err, user_found){
		if(err){
			console.log(err);
			return;
		}
		res.render("user_delete", {title: "Delete User", user: user_found});
	})
};

exports.user_delete_post = function(req, res){
	User.findByIdAndRemove(req.params.id).exec(function(err){
		if(err){
			console.log(err);
			return;
		}

		res.redirect('/catalog/users');
	})
};

exports.user_update_get = function(req, res){
	User.findById(req.params.id).exec(function(err, user_found){
		if(err){
			console.log(err);
			return;
		}

		res.render('user_update', {title: 'User update page', user: user_found});
	})
};

exports.user_update_post = function(req, res){
	req.sanitize('username').escape();
	req.sanitize('username').trim();

	req.sanitize('password').escape();
	req.sanitize('password').trim();

	req.sanitize('email').escape();
	req.sanitize('email').trim();

	User.findById(req.params.id).exec(function(err, user_found){
		if(err){
			console.log(err);
			return;
		}
		var new_username;
		var new_password;
		var new_email;

		if(req.body.username == ''){
			new_username = user_found.username;
		}
		else{
			new_username = req.body.username;
		}
		if(req.body.password == ''){
			new_password = user_found.password;
		}
		else{
			new_password = req.body.password;
		}
		if(req.body.email == ''){
			new_email = user_found.email;
		}
		else{
			new_email = req.body.email;
		}

		var updated_user = new User({username: new_username, password: new_password, email: new_email, _id: req.params.id});


		User.findByIdAndUpdate(req.params.id, updated_user, {}, function(err, user_found){
			if(err){
				console.log(err);
				return;
			}

			res.redirect(user_found.url);
		})
	})
};