var express = require('express');
var router = express.Router();

var gymkoController = require('../controllers/gymko_controller');
var playerController = require('../controllers/player_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');

// GET home page
router.get('/', function(req, res) {
  res.render('index', { title: 'Gymko' , errors: []});
});

// Autoload de comandos
router.param('gymkoId', gymkoController.load_GymkoId); //Si existe parametro gymkoId hace el autoload
router.param('noteId', gymkoController.load_NoteId); //Si existe parametro noteId hace el autoload

// Definicion de rutas /gymkos
router.get('/gymkos', gymkoController.index_gymko);
router.get('/my_gymkos', gymkoController.index_mygymkos);
router.get('/gymkos/:gymkoId(\\d+)', gymkoController.show_gymko);
router.get('/gymkos/:gymkoId(\\d+)/answer', gymkoController.answer);
router.get('/gymkos/new', sessionController.loginRequired, gymkoController.new_gymko); //new gymko
router.post('/gymkos/create', sessionController.loginRequired, gymkoController.create_gymko); //post gymko
router.get('/gymkos/:gymkoId(\\d+)/edit', sessionController.loginRequired, gymkoController.edit_gymko); //edit gymko
router.put('/gymkos/:gymkoId(\\d+)', sessionController.loginRequired, gymkoController.update_gymko); //put gymko
router.delete('/gymkos/:gymkoId(\\d+)', sessionController.loginRequired, gymkoController.destroy_gymko); //delete gymko
router.get('/gymkos/statistics', gymkoController.statistics);
router.post('/gymkos/:gymkoId(\\d+)/koto/create', sessionController.loginRequired, gymkoController.create_koto); //post gymko
router.get('/gymkos/:gymkoId(\\d+)/notes/new', gymkoController.new_note); //new note
router.post('/gymkos/:gymkoId(\\d+)/notes', gymkoController.create_note); //post note
//router.get('/gymkos/:gymkoId(\\d+)/notes/:noteId(\\d+)/publish', sessionController.loginRequired, gymkoController.publish_note);


// Definicion de rutas /player
router.get('/gymkos/:gymkoId(\\d+)/:userId(\\d+)', playerController.show_gymko);
router.post('/gymkos/:gymkoId(\\d+)/:userId(\\d+)/create', playerController.create_player);
router.post('/gymkos/:gymkoId(\\d+)/:playerId(\\d+)/photo/:kotoId(\\d+)/create', playerController.create_photo);
//router.get('/gymkos/:gymkoId(\\d+)/:playerId(\\d+)/:photoId(\\d+)/comments/new', playerController.new_comment);
//router.post('/gymkos/:gymkoId(\\d+)/:playerId(\\d+)/:photoId(\\d+)/comments', playerController.create_comment);
//router.get('/gymkos/:gymkoId(\\d+)/:playerId(\\d+)/:photoId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, playerController.publish_comment);
	// debería ser put ya que actualizamos los datos al hacer publish

// Definicion de rutas de session
router.get('/login', sessionController.new); // formulario login
router.post('/login', sessionController.create); // crear session
router.get('/logout', sessionController.destroy); // destruir session - lo ideal sería utilizar delete

// Definicion de rutas de user
router.get('/users/new', userController.new); // formulario nuevo usuario
router.post('/users/create', userController.create); // crear nuevo usuario

// GET author page
router.get('/author', function(req, res){
  res.render('author', {errors: []});
});

// GET error

module.exports = router;
