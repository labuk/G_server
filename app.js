// Importar paquetes con middlewares
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

// Importar enrutadores
var routes = require('./routes/index');

// Crear aplicación
var app = express();

// view engine setup - Instalar generador de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Instalar middlewares
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'Gymkoto',
  httpOnly: true,
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 1000*60*60 }
}));
app.use(partials());
app.use(methodOverride('_method'));
// Solo para Localhost - Admite todas las entradas de POST
//app.use(cors());

// Helpers dinamicos:
app.use(function(req, res, next){

  //res.header('Access-Control-Allow-Origin', 'http://192.168.1.43:3000');
  //res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  //res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Content-Length,Origin');
  //res.header('Access-Control-Allow-Credentials', true);

  req.session.redir = req.session.redir || "/";

  //guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
	   req.session.redir = req.path;
  }

  if (!req.session.user) { // Sesion para no hacer login continuo
  //Creamos session para usuario Anonimo
     req.session.user = {online: 'true'};
     if(req.body){
       if (req.body.userId){
       req.session.user.id = req.body.userId;
       }
     }
     if(req.query){
       if (req.query.userId){
         req.session.user.id = req.query.userId;
       }
     }
     req.session.autologout = Date.now();
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();

});
/*
// Auto logout: al estar más de 2 minutos sin conectar por http
app.use(function(req, res, next) {
    req.session.autologout = req.session.autologout || 0;
    if (req.session.user && (Date.now() - req.session.autologout) > 12000000) {
	console.log('Logout');
	var err = new Error('Mas de 20 minutos sin actividad. La sessión se va a desconectar.');
	//callback(new Error('Mas de 2 minutos sin actividad. La sessión se va a desconectar.'));
	req.session.errors = [{"mess_logout": 'Mas de 20 minutos sin actividad. Vuelve a autentificarte.'}];
	req.session.redir = "/login";
	//res.render("/login")
	res.redirect("/logout");
	next();
	//next(err);
    } else {
	req.session.autologout = Date.now();
	next();
    }

});
*/
// Instalar enrutadores
app.use('/', routes);

// catch 404 and forward to error handler - Resto de rutas: genera error 404 de HTTP
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler: will print stacktrace - Gestión de errores durante el desarrollo
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
	    errors: []
        });
    });
}

// production error handler: no stacktraces leaked to user - Gestión de errores de producción
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
	errors: []
    });
});

// Exportar app para comando de arranque
module.exports = app;
