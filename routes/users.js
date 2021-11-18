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
    const user= req.flash('user')[0] || {};
    const errors = req.flash('errors')[0] || {};
    res.render('users/join',{user:user, errors:errors});
});

//join
router.post('/', function(req, res){
    User.create(req.body, function(err, user){
        if(err) {
            req.flash('user', req.body);
            req.flash('errors', parseError(err)); //error객체의 형식이 다 다르므로 parseError라는 함수를 따로 만들어서 분석해 일정한 형식으로 만들어준다.
            return res.redirect('/users/new')
        }
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

//edit //11-18 여기부터 다시 해야함 
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

