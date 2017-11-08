// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function (req, res, next){
	if (req.session.user) {
	  next();
	} else {
	  res.redirect('/login');
	}
};

// GET /login
exports.new = function(req,res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

// POST /login
exports.create = function(req,res){

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {

	  // Si hay un error retornamos mensajes de error de sesion
	  if (error) {
		req.session.errors = [{"message": 'Se ha producido un error: '+ error}];
		res.send({alert: '-'+ error});
		return;
	  }

	  // Crear req.session.user y guardar campos id y username
	  // La sesion se define por la existencia de: req.session.user
	  req.session.user = {id:user.id, username: user.usr_name};
		res.send(req.session.user); // redireccionamos a path anterior a login

	});
};

// GET /logout
exports.destroy = function(req,res){
	console.log("Delete");
	delete req.session.user;
	res.redirect(req.session.redir.toString()); // redirect a path anterior a logout
};
