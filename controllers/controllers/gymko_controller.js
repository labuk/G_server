// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Sequelize
var sequelize = require('sequelize');

var formidable = require('formidable');
var form = new formidable.IncomingForm({
  uploadDir: './public/images/kotos',
  multiples: true // req.files to be arrays of files
});
var fs = require('fs-extra');

// Autoload - Factoriza el código si la ruta incluye :gymkoId
exports.load_GymkoId = function(req, res, next, gymkoId){
	models.Gymko.find({
		  where: { id:Number(gymkoId) }
	}).then(function(gymko){
		if (gymko){
		req.gymko = gymko;
		next();
		} else { next(new Error('No existe gymkoId=' + gymkoId)); }
	}).catch(function(error){ next(error);} );
};

// Autoload - Factoriza el código si la ruta incluye :noteId
exports.load_NoteId = function(req, res, next, noteId){
	models.Note.find({
		  where: { id:Number(noteId) }
		}).then(function(note){
		if (note){
		req.note = note;
		next();
	} else { next(new Error('No existe noteId=' + noteId)); }
	}).catch(function(error){ next(error);} );
};


// GET gymkos
exports.index_gymko = function(req, res){
	if(req.query.search){
		var search_string = req.query.search.replace(/ |\u0195|\xc3/g,'%');
		var search_string = '%'+search_string+'%';
		console.log('Search: '+search_string);
		models.Gymko.findAll({where: ["gym_description like ?", search_string], order:'gym_description ASC'}).then(function(gymkos){
			res.render('gymkos/index',{ gymkos: gymkos, errors: []});
			console.log('Search results: '+gymkos.length);

		})
	} else {
	models.Gymko.findAll({
		  where: { UserId: req.session.user.id }
	}).then(function(gymkos){
		models.Player.findAll({
				where: { UserId: req.session.user.id },
				include: [{model: models.Gymko, attributes: ['gym_description','gym_topic']}]
		}).then(function(players){
			models.Gymko.findAll({
					where: { UserId: {$ne: req.session.user.id} }
			}).then(function(gymkos_rand) {
				res.render('gymkos/index',{ gymkos: gymkos, players: players, gymkos_rand: gymkos_rand, errors: []});
	})})}).catch(function(error){next(error);})	}
};

// GET /gymkos/:gymkoid
exports.show_gymko = function(req, res){
	models.Koto.findAll({
		where: { GymkoId: req.gymko.id }
	}).then(function(kotos){
		models.Note.findAll({
			where: { GymkoId: req.gymko.id }
		}).then(function(notes){
			res.render('gymkos/show',{ gymko: req.gymko, kotos: kotos, notes: notes, errors: []});
	})});
};

// GET /gymkos/:gymkoId/answer
exports.answer = function(req,res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.gymko.respuesta){
		resultado = 'Correcto';
	}
	res.render('gymkos/answer', {gymko: req.gymko, respuesta: resultado, errors: []});
};

// GET /gymkos/statictics
exports.statistics = function(req,res){
	console.log('Search and count');

	// Se utiliza Promise.all para realizar consultas asíncronas en paralelo
	var stats = {};
	sequelize.Promise.all([
  	   models.Gymko.count(),
	   models.Note.count(),
	   models.Gymko.findAll({ include: [{model: models.Note, required: true}] }),
	]).then(function(result){
		stats.gymko = result[0];
		stats.note = result[1];
		stats.note_gymko = result[1]/result[0];
		stats.withNote = result[2].length;
		stats.woutNote = result[0] - result[2].length;
		res.render('gymkos/statistics',{ statictics: stats, errors: []});

	});
};

// GET /gymkos/new
exports.new_gymko = function(req,res){
 	var gymko = models.Gymko.build(
		{gym_description: "Descripción"}
	);

	res.render('gymkos/new', {gymko: gymko, errors: []});
};

// POST /gymkos/create
exports.create_gymko = function(req,res){
 	var gymko = models.Gymko.build(req.body.gymko);
	gymko.UserId = req.session.user.id;
	console.log(gymko);
	gymko.validate().then(function(err){
		if (err) {
			res.render('gymkos/new', {gymko: gymko, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			gymko.save({fields: ["gym_description","gym_topic","UserId"]}).then(function(){
			res.redirect('/gymkos');})
		}
	});
};

// GET /gymkos/:gymkoId/edit
exports.edit_gymko = function(req,res){
	models.Koto.findAll({
		where: { GymkoId: req.gymko.id }
	}).then(function(kotos){
	 	var gymko = req.gymko;
		res.render('gymkos/edit', {gymko: gymko, kotos: kotos, errors: []});
	});
};

// PUT /gymkos/:gymkoId
exports.update_gymko = function(req,res){
	req.gymko.gym_description = req.body.gymko.gym_description;
	req.gymko.gym_topic = req.body.gymko.gym_topic;

	req.gymko.validate().then(function(err){
		if (err) {
			res.render('gymkos/edit', {gymko: gymko, errors: err.errors});
		} else {
			// cambia en DB los campos pregunta y respuesta
			req.gymko.save({fields: ["gym_description","gym_topic"]}).then(function(){
			res.redirect('/gymkos');})
		}
	});
};

// DELETE /gymkos/:gymkoId
exports.destroy_gymko = function(req,res){
	console.log('1');
 	req.gymko.destroy().then( function() {
		res.redirect('/gymkos');
	}).catch(function(error){next(error)});
};

// POST /gymkos/:gymkoId/koto/create
exports.create_koto = function(req,res){

	var koto = models.Koto.build();
	form.parse(req, function(err, fields, files) {
		koto.kot_url = files.kot_photo.path.substr(7);
    koto.kot_description = fields.kot_description;
  });

	form.on('end', function(fields, files) {
		koto.GymkoId = req.gymko.id;
		koto.UserId = req.session.user.id;
		koto.validate().then(function(err){
			if (err) {
				res.render('/gymkos/'+req.gymko.id+'/edit', {gymko: gymko, errors: err.errors});
			} else {
				// guarda en DB los campos pregunta y respuesta
				koto.save().then(function(new_koto){
					/*
					var file_name = "/koto_"+req.session.user.id+"_"+new_koto.id;
						fs.copy(temp_path,'./public/images/kotos' + file_name, function(err) {
							if (err) {
								console.log("Fallo!");
							} else {
								console.log("success!");
							}
						});
					*/
					res.redirect('/gymkos/'+req.gymko.id+'/edit');
				})
			}
		});
  });

};

// GET /gymkos/:gymkoId/notes/new
exports.new_note = function(req,res){
	res.render('gymkos/new_note', {gymkoid: req.params.gymkoId, errors: []});
};

// POST /gymkos/:gymkoId/notes
exports.create_note = function(req,res){
 	var note = models.Note.build(
		{ not_text: req.body.note.not_text,
		  GymkoId: req.params.gymkoId,
			UserId: req.session.user.id
		});

	note.validate().then(function(err){
		if (err) {
			res.render('notes/new', {note: note, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			note.save().then(function(){
			res.redirect('/gymkos/'+req.params.gymkoId);})
		}
	}).catch(function(error){next(error)});
};

/*
// GET /gymkos/:gymkoId/notes/:noteId/publish
exports.publish = function(req,res){
	req.note.publicado = true;

	req.note.save({ fields: ["publicado"]}).then(
		function(){res.redirect('/gymkos/'+req.params.gymkoId);}
		).catch( function(error){next(error)} );
};
*/
