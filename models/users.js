var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = Schema({
	username: {type : String, required : true},
	password: {type : String, required : true},
	email: {type : String, required : true}
})

userSchema
.virtual('url')
.get(function(){
	return '/catalog/users/' + this._id;
});

module.exports = mongoose.model('users', userSchema);