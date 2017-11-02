var path = require('path');
var fs = require('fs');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite
DATABASE_URL = "sqlite://:@:/"
//MySql

//var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var url = DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{dialect: dialect,
	 protocol: protocol,
	 port: port,
  	 host: host,
	 storage: storage,
	 omitNull: true
});

// Importar la definición de la tabla User en user.js
var user_path = path.join(__dirname, 'user/user')
var User = sequelize.import(user_path);

// Importar la definición de la tabla Contact en contact.js
var contact_path = path.join(__dirname, 'user/contact')
var Contact = sequelize.import(contact_path);
	Contact.belongsTo(User);

// Importar la definición de la tabla Gymko en gymko.js
var gymko_path = path.join(__dirname, 'gymko/gymko')
var Gymko = sequelize.import(gymko_path);
	Gymko.belongsTo(User);

// Importar la definición de la tabla Koto en koto.js
var koto_path = path.join(__dirname, 'gymko/koto')
var Koto = sequelize.import(koto_path);
	Koto.belongsTo(Gymko);
	Gymko.hasOne(Koto, {onDelete: 'cascade', hooks:true});
	Koto.belongsTo(User);

// Importar la definición de la tabla Note en note.js
var note_path = path.join(__dirname, 'gymko/note')
var Note = sequelize.import(note_path);
	Note.belongsTo(Gymko);
	Gymko.hasOne(Note, {onDelete: 'cascade', hooks:true});
	Note.belongsTo(User);

// Importar la definición de la tabla Player en player.js
var player_path = path.join(__dirname, 'player/player')
var Player = sequelize.import(player_path);
	Player.belongsTo(Gymko);
	Gymko.hasOne(Player, {onDelete: 'cascade', hooks:true});
	Player.belongsTo(User);

// Importar la definición de la tabla Photo en photo.js
var photo_path = path.join(__dirname, 'player/photo')
var Photo = sequelize.import(photo_path);
	Photo.belongsTo(Player);
	Player.hasOne(Photo, {onDelete: 'cascade', hooks:true});
	Photo.belongsTo(Koto);
	Koto.hasOne(Photo, {onDelete: 'cascade', hooks:true});
	Photo.belongsTo(User);

// Importar la definición de la tabla Like en like.js
var like_path = path.join(__dirname, 'player/like')
var Like = sequelize.import(like_path);
	Like.belongsTo(Photo);
	Photo.hasOne(Like, {onDelete: 'cascade', hooks:true});
	Like.belongsTo(User);

// Importar la definición de la tabla Comment en comment.js
var comment_path = path.join(__dirname, 'gymko/comment')
var Comment = sequelize.import(comment_path);
	Comment.belongsTo(Photo);
	Photo.hasOne(Comment, {onDelete: 'cascade', hooks:true});
	Comment.belongsTo(User);

exports.Gymko = Gymko; // exportar definición de tabla Gymko
exports.Koto = Koto; // exportar definición de tabla Gymko
exports.Note = Note; // exportar definición de tabla Note
exports.Player = Player; // exportar definición de tabla Player
exports.Photo = Photo; // exportar definición de tabla Photo
exports.Like = Like; // exportar definición de tabla Like
exports.Comment = Comment; // exportar definición de tabla Comment
exports.User = User; // exportar definición de tabla User
exports.Contact = Contact; // exportar definición de tabla Contact

User.count().then(function (count){
	if (count === 0){ // la tabla se inicializa solo si está vacía
		User.create({
			usr_name: 'Anon',
			usr_pass: '1234'
		});
	}
});

// Desplegamos todas las migraciones pendientes
var Umzug = require('umzug');
var umzug = new Umzug({
	storage: 'none',
	migrations: {
		params: [sequelize.getQueryInterface(), Sequelize],
		path: './config/migrations',
		pattern: /\.js$/
  }
});
