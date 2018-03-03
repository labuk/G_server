// Importamos modelo DB
var models = require('../models/models.js');

// Goolge Cloud Storage
var Storage = require('@google-cloud/storage');
const CLOUD_BUCKET = "gymkoto-195110.appspot.com";
const storage = Storage({
  projectId: "gymkoto-195110"
});
const bucket = storage.bucket(CLOUD_BUCKET);

var formidable = require('formidable');
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
	models.Photo.findAll({
		where: { GymkoId: req.gymko.id },
    include: [{model: models.User, attributes: ['usr_name']}]
	}).then(function(photos){
		models.Note.findAll({
			where: { GymkoId: req.gymko.id },
      include: [{model: models.User, attributes: ['usr_name']}]
		}).then(function(notes){
			models.Player.find({
				where: {
					GymkoId: req.gymko.id,
					UserId: req.params.userId
				}
			}).then(function(player){
				if (player) {
					models.Photo.findAll({
						where: { PlayerId: player.id }
					}).then(function(photo){
						//console.log(player);
						res.send({ gymko: req.gymko, photos: photos, player: player, photo: photo, notes: notes, errors: [] });
					});
				} else {
						res.send({ gymko: req.gymko, photos: photos, player: player, notes: notes, errors: [] });
				}
	});});});
};

// POST /gymkos/:gymkoid/:userId/create
exports.create_player = function(req,res){
 	var player = models.Player.build(
		{ GymkoId: req.params.gymkoId,
			UserId: req.params.userId
		});
	player.validate().then(function(err){
		if (err) {
			res.render('gymkos/new', {gymko: gymko, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			player.save({fields: ["GymkoId","UserId"]}).then(playerSave => {
        models.Gymko.find({
            where: { id:req.params.gymkoId }
        }).then(function(gymko){
          gymko.gym_follow = gymko.gym_follow + 1;
          gymko.save({fields: ["gym_follow"]}).then(function() {
            res.send(playerSave);
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
        userId: req.params.userId }
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
  	}).catch(function(error){next(error);});
  });
};

// POST /gymkos/:gymkoId/photo/:kotoId/create/:userId
exports.create_photo = function(req,res){
  var form_photo = new formidable.IncomingForm({
    //uploadDir: './public/images/photos',
    multiples: true // req.files to be arrays of files
  });

  var photo =  models.Photo.build();
  var file_path;
  form_photo.parse(req, function(err, fields, files) {
    console.log(files);
  });

	form_photo.on('fileBegin', function(name, file) {
		console.log('fileBegin');
		console.log(file.path);
		if(file.path) {
			photo.pho_url = file.path.substr(5);
			file_path = file.path;
			photo.GymkoId = req.params.gymkoId;
			photo.KotoId = req.params.kotoId;
			photo.UserId = req.params.userId;
		} else {
			photo = 0;
			file_path = 0;
		}
		console.log(file_path);
	});

  form_photo.on('end', function() {

		console.log('End');

		var file = bucket.file(file_path.substr(5));

    if (photo) {

			fs.createReadStream(file_path)
			.pipe(file.createWriteStream({
				metadata: {
					contentType: 'image/jpeg'
				}
			}))
			.on('error', function(err) {
				console.log('error');
				res.send(err);
			})
			.on('finish', function() {
				console.log('finish');
				file.makePublic().then(() => {
						console.log('send end');
						models.Player.find({
					      where: {
					        gymkoId: req.params.gymkoId,
					        userId: req.params.userId }
					  }).then(function(player){
							if(player) {
								photo.PlayerId = player.id;
								photo.validate().then(function(err){
									if (err) {
										res.send({errors: err.errors});
									} else {
										// guarda en DB los campos pregunta y respuesta
										photo.save().then(function(new_photo){
											models.Player.update({
												pla_goal: 1
											}, {
												where: { id: player.id }
											}).then(function(){
												res.send(file_path.substr(5));
											})
									})}
								});
							} else {
								var player = models.Player.build(
									{ GymkoId: req.params.gymkoId,
										UserId: req.params.userId,
										pla_goal: 1
									});
								player.validate().then(function(err){
									if (err) {
										res.render('gymkos/new', {gymko: gymko, errors: err.errors});
									} else {
										// guarda en DB los campos pregunta y respuesta
										player.save({fields: ["pla_goal","GymkoId","UserId"]}).then(playerSave => {
											photo.PlayerId = playerSave.id;
											models.Gymko.find({
													where: { id:req.params.gymkoId }
											}).then(function(gymko){
												gymko.gym_follow = gymko.gym_follow + 1;
												gymko.save({fields: ["gym_follow"]}).then(function() {
													photo.validate().then(function(err){
														if (err) {
															res.send({errors: err.errors});
														} else {
															// guarda en DB los campos pregunta y respuesta
															photo.save().then(function(new_photo){
																res.send(file_path.substr(5));
														})}
													});
												});
											});
									});}
								});
							}
						});
					});
			});
    } else {
	  console.log('No se ha subido el archivo');
      res.send(file_path);
    }

  });

};

// DELETE /gymkos/:gymkoId/photo/:photoId
exports.destroy_photo = function(req, res, next){
  console.log('Destroy');
  models.Photo.find({
      where: {
        id: req.params.photoId
      }
  }).then(function(photo){
    photo.destroy().then( function() {
      res.send({alert: 'Ok'});
    }).catch(function(error){next(error);});
  });
};

// GET /my_rewards
exports.index_myrewards = function(req, res, next){
	console.log('Reward');
	models.Reward.findAll({
    where: { UserId: req.session.user.id },
    order: 'Reward.updatedAt DESC',
		include: [{model: models.Gymko, attributes: ['gym_description','gym_topic','id','createdAt']}]
	}).then(function(rewards){
		res.send({ rewards: rewards });
	}).catch(function(error){
		console.log(error);
		next(error);
	});
};

// GET /prizes
exports.index_prizes = function(req, res, next){
	console.log('Reward');
	models.Reward.findAll({
    where: {
			UserId: req.session.user.id,
			rew_points: {$lt: 0}
		},
    order: 'Reward.updatedAt DESC',
		include: [{model: models.Gymko, attributes: ['gym_description','gym_topic','gym_url','gym_follow','id','updatedAt','createdAt']}]
	}).then(function(rewards){
		res.send({ rewards: rewards });
	}).catch(function(error){
		console.log(error);
		next(error);
	});
};

// POST /gymkos/reward/:gymkoid/:userId/create
exports.create_reward = function(req,res) {
	console.log('Reward');
	models.User.find({
			where: { id: req.params.userId }
	}).then(function(user){
    models.Gymko.find({
        where: { id:req.params.gymkoId }
    }).then(function(gymko){
  		user.usr_points = parseInt(user.usr_points) + parseInt(gymko.gym_point);
  		if(user.usr_points < 0){
  			res.send({points: 1});
  		} else {
  			models.Reward.find({
  				where: {
  					gymkoId: req.params.gymkoId,
  					userId: req.params.userId }
  			}).then(function(reward){
  				if(reward) {
  					console.log('Reward concedida');
  					res.send({points: 0});
  				} else {
  					var points = gymko.gym_point;
  					models.Gymko.find({
  						where: {
  							id: req.params.gymkoId
  						}
  					}).then(function(gymko){
  						var reward = models.Reward.build(
  							{ rew_points: points,
  								GymkoId: req.params.gymkoId,
  								UserId: req.params.userId
  							});
  						reward.validate().then(function(err){
  							if (err) {
  								console.log(err);
  								res.render('gymkos/new', {gymko: gymko, errors: err.errors});
  							} else {
  								// guarda en DB los campos pregunta y respuesta
  								reward.save().then(function(){
  									//console.log('User');
  									//models.User.find({
  									//		where: { id: req.params.userId }
  									//}).then(function(user){
  										user.usr_points = parseInt(user.usr_points) + parseInt(points);
  										user.save({fields: ["usr_points"]}).then(function(){
  											res.send({points: points});
  										});
  									//});
  							});}
  						});
  					});
  				}
  			});
  		}
    });
	});
};

// POST /gymkos/prize/:gymkoid/:userId/create
exports.create_prize = function(req,res){
  	console.log('Prize');
  	models.User.find({
  			where: { id: req.body.userId }
  	}).then(function(user){
      console.log(req.body);
      console.log(user);
  		user.usr_points = parseInt(user.usr_points) + parseInt(req.body.rew_points);
  		if(user.usr_points < 0){
  			res.send({points: 1});
  		} else {
  			models.Reward.find({
  				where: {
  					gymkoId: req.params.gymkoId,
  					userId: req.body.userId }
  			}).then(function(reward){
  				if(reward) {
  					console.log('Reward concedida');
  					res.send({points: 0});
  				} else {
  					var points = req.body.rew_points;
  					models.Gymko.find({
  						where: {
  							id: req.params.gymkoId
  						}
  					}).then(function(gymko){
  						var reward = models.Reward.build(
  							{ rew_points: points,
  								GymkoId: req.params.gymkoId,
  								UserId: req.body.userId
  							});
  						reward.validate().then(function(err){
  							if (err) {
  								console.log(err);
  								res.render('gymkos/new', {gymko: gymko, errors: err.errors});
  							} else {
  								// guarda en DB los campos pregunta y respuesta
  								reward.save().then(function(){
  										user.usr_points = parseInt(user.usr_points) + parseInt(points);
  										user.save({fields: ["usr_points"]}).then(function(){
  											res.send({points: points});
  										});
  									//});
  							});}
  						});
  					});
  				}
  			});
  		}
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
			res.redirect('/gymkos/'+req.params.gymkoId);});
		}
	}).catch(function(error){next(error);});
};

// GET /gymkos/:gymkoId/comments/:commentId/publish
exports.publish = function(req, res, next){
	req.comment.publicado = true;

	req.comment.save({ fields: ["publicado"]}).then(
		function(){res.redirect('/gymkos/'+req.params.gymkoId);}
		).catch( function(error){next(error);} );
};
