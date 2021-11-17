const express = require('express');
const router = express.Router();
const User = require('../models/User');

//Index
router.get('/', function(req, res){
    User.find({})
        .sort({username:1})
        .exec(function(err, users){
            if(err) return res.json(err);
            res.render('users/index', {users:users});
        });
});

//New
router.get('/join', function(req, res){
    res.render('users/join');
});

//join
router.post('/', function(req, res){
    User.create(req.body, function(err, user){
        if(err) return res.json(err);
        res.redirect('/users');
    });
});

//show
router.get('/:username', function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        res.render('users/show',{user:user});
    });
});

//edit
router.get('/:username/edit', function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        res.render('users/edit', {user:user});
    });
});

//update
router.put('/:username', function(req, res, next){
    User.findOne({username:req.params.username})
        .select('password')
        .exec(function(err, user){
            if(err) return res.json(err);

            user.originalPassword = user.password;
            user.password = req.body.newPassword ? req.body.newPassword:user.password;
            for(var p in req.body){
                user[p] = req.body[p];
            }

            user.save(function(err, user){
                if(err) return res.json(err);
                res.redirect('/users/'+user.username);
            });
        });
});

//delete
router.delete('/:username', function(req, res){
    User.deleteOne({ussername:req.params.username}, function(err){
        if(err) return res.json(err);
        res.redirect('/users');
    });
})

module.exports = router;

