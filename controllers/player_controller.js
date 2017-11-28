// Importamos modelo DB
var models = require('../models/models.js');

var formidable = require('formidable');
var form = new formidable.IncomingForm({
  uploadDir: './public/images/photos',
  multiples: true // req.files to be arrays of files
});
var fs = require('fs-extra');


// Autoload - Factoriza el código si la ruta incluye :commentId
exports.load = function(req, res, next, commentId){
	models.Comment.find({
		  where: { id:Number(commentId) }
		}).then(function(comment){
		if (comment){
		req.comment = comment;
		next();
		} else { next(new Error('No existe commentId=' + commentId)); }
	}).catch(function(error){ next(error);} );
};

// GET /gymkos/:gymkoid/:userId
exports.show_gymko = function(req, res){
	models.Koto.findAll({
		where: { GymkoId: req.gymko.id }
	}).then(function(kotos){
		models.Note.findAll({
			where: { GymkoId: req.gymko.id },
      include: [{model: models.User, attributes: ['usr_name']}]
		}).then(function(notes){
			models.Player.find({
				where: {
					GymkoId: req.gymko.id,
					UserId: req.session.user.id
				}
			}).then(function(player){
				if (player) {
					models.Photo.findAll({
						where: { PlayerId: player.id }
					}).then(function(photos){
						//console.log(player);
						res.send({ gymko: req.gymko, kotos: kotos, player: player, photos: photos, notes: notes, errors: [] });
					});
				} else {
						res.send({ gymko: req.gymko, kotos: kotos, player: player, notes: notes, errors: [] });
				}
	})})});
};

// POST /gymkos/:gymkoid/:userId/create
exports.create_player = function(req,res){
 	var player = models.Player.build(
		{ GymkoId: req.params.gymkoId,
			UserId: req.session.user.id
		});
	player.validate().then(function(err){
		if (err) {
			res.render('gymkos/new', {gymko: gymko, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			player.save({fields: ["GymkoId","UserId"]}).then(function(){
        models.Gymko.find({
            where: { id:req.params.gymkoId }
        }).then(function(gymko){
          gymko.gym_follow = gymko.gym_follow + 1;
          gymko.save({fields: ["gym_follow"]}).then(function(){
            res.send({alert: 'Ok'});
          });
        });
		});}
	});
};

// DELETE /gymkos/:gymkoid/:userId/delete
exports.destroy_player = function(req, res, next){
  models.Player.find({
      where: {
        gymkoId: req.params.gymkoId,
        userId: req.session.user.id }
  }).then(function(player){
   	player.destroy().then( function() {
      models.Gymko.find({
          where: { id:req.params.gymkoId }
      }).then(function(gymko){
        gymko.gym_follow = gymko.gym_follow - 1;
        gymko.save({fields: ["gym_follow"],  silent: true }).then(function(){
          res.send({alert: 'Ok'});
        });
      });
  	}).catch(function(error){next(error)});
  });
};

// POST /gymkos/:gymkoid/:playerId/photo/:playerId/:kotoId/create
exports.create_photo = function(req,res){
  var photo =  models.Photo.build();
  form.parse(req, function(err, fields, files) {
    photo.pho_url = files.pho_photo.path.substr(7);
  });
  form.on('end', function(fields, files) {
    photo.PlayerId = req.params.playerId;
    photo.KotoId = req.params.kotoId;
    photo.UserId = req.session.user.id;
    photo.validate().then(function(err){
      if (err) {
        res.render('gymkos/new', {gymko: gymko, errors: err.errors});
      } else {
        // guarda en DB los campos pregunta y respuesta
        photo.save().then(function(new_photo){
        console.log(new_photo);
        /*
        var file_name = "/photo_"+req.session.user.id+"_"+new_photo.id;
          fs.copy(temp_path,'./public/images/photos' + file_name, function(err) {
            if (err) {
              console.log("Fallo!");
            } else {
              console.log("success!");
            }
          });
        */
        res.redirect('/gymkos/'+req.params.gymkoId+'/'+req.session.user.id);
      })}
    });
  });

};

// GET /gymkos/:gymkoId/comments/new
exports.new = function(req,res){
	res.render('comments/new', {gymkoid: req.params.gymkoId, errors: []});
};

// POST /gymkos/:gymkoId/comments
exports.create = function(req, res, next){
 	var comment = models.Comment.build(
		{ com_text: req.body.comment.texto,
		  GymkoId: req.params.gymkoId,
			UserId: req.session.user.id
		});

	comment.validate().then(function(err){
		if (err) {
			res.render('comment/new', {comment: comment, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			comment.save().then(function(){
			res.redirect('/gymkos/'+req.params.gymkoId);})
		}
	}).catch(function(error){next(error)});
};

// GET /gymkos/:gymkoId/comments/:commentId/publish
exports.publish = function(req, res, next){
	req.comment.publicado = true;

	req.comment.save({ fields: ["publicado"]}).then(
		function(){res.redirect('/gymkos/'+req.params.gymkoId);}
		).catch( function(error){next(error)} );
};
