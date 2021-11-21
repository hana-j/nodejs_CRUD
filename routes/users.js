const express = require('express');
const router = express.Router();
const User = require('../models/User');
const util = require('../util');



//New
router.get('/join', function(req, res){
    const user= req.flash('user')[0] || {};
    const errors = req.flash('errors')[0] || {};
    res.render('users/join',{user:user, errors:errors});
});

//join
router.post('/', function(req, res){
    User.create(req.body, function(err, user){
        if(err){
            req.flash('user', req.body);
            req.flash('errors', util.parseError(err)); //error객체의 형식이 다 다르므로 parseError라는 함수를 따로 만들어서 분석해 일정한 형식으로 만들어준다.
            return res.redirect('/users/join')
        }
        res.redirect('/login');
    });
});

//show
router.get('/:username', util.isLoggedin, checkPermission, function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        res.render('users/show',{user:user});
    });
});

//edit //11-18 여기부터 다시 해야함 
router.get('/:username/edit', util.isLoggedin, checkPermission, function(req, res){
    const user = req.flash('user')[0];
    const errors =  req.flash('errors')[0] || {};
    if(!user){
        User.findOne({username:req.params.username}, function(err, user){
            if(err) return res.json(err);
            res.render('users/edit', {username:req.params.username, user:user, errors:errors});
        });
    }else{
        res.render('users/edit', {username:req.params.username, user:user, errors:errors});
    }
});

//update
router.put('/:username', util.isLoggedin, checkPermission, function(req, res, next){
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
                if(err) {
                    req.flash('user', req.body);
                    req.flash('errors', util.parseError(err));
                    return res.redirect('/users/'+req.params.username+'/edit');
                }
                res.redirect('/users/'+user.username);
            });
        });
});

function checkPermission(req, res, next){
    User.findOne({username:req.params.username} , function(err, user){
        if(err) return res.json(err);
        if(user.id != req.user.id) return util.noPermission(req, res);

        next();
    });
    
}

module.exports = router;




