/*var users = {	admin: {id:1, username:"admin", password:"1234"},
		pepe:  {id:2, username:"pepe", password:"5678"}
	    };
			*/

// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Crypto
var crypto = require('crypto');

// GET /users/new
exports.new = function(req,res){
  var errors = req.session.errors || {};
  req.session.errors = {};

	res.render('users/new', {errors: errors});
};

// POST /users/create
exports.create = function(req,res){

	// hash and salt the password
	var salt = crypto.randomBytes(128).toString('base64'),
			key;
	crypto.pbkdf2( req.body.usr_pass, salt, 10000, 512, 'sha512', function(err, dk) {
		key = dk.toString('hex');
		var user = models.User.build(
			{ usr_name: req.body.usr_name,
				usr_pass: key,
				usr_salt: salt
			});
		user.validate().then(function(msg, err){
			if (err) {
				res.render('user/new', {errors: err.errors});
			} else {
				// guarda en DB los campos pregunta y respuesta
				user.save().then(function(err){
					res.send('Ok');}
				).catch(function(error){
					console.log("Catch");
					req.session.errors = [{"message": "El nombre de usuario no está disponible"}];
					res.send("El nombre de usuario no está disponible");
				});
			}
		}).catch(function(error){next(error);});
	});
};


// Comprueba si el usuario esta registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error)
exports.autenticar = function(login, password, callback){
	models.User.find({where: ["usr_name like ?", login]})
	.then(function(user){
		if (user){
			// hash and salt the password
			crypto.pbkdf2(password, user.usr_salt, 10000, 512, 'sha512', function(err, dk) {
				key = dk.toString('hex');
				if (user.usr_pass === key) {
			   callback(null, user);
		  	} else {callback(new Error('Password erróneo.'));}
			});
	   } else {callback(new Error('No existe el usuario.'));}
	})
};
