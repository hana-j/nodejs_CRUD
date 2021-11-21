//crud기능
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//Index
router.get('/', function(req, res){
    Post.find({})
    .populate('author')     //Model.populate() 함수는 relationship이 형성되어 있는 항목의 값을 생성해준다.
    .sort('-createdAt')
    .exec(function(err, posts){
        if(err) return res.json(err);
        res.render('posts/index', {posts:posts});
    });
});

//New post
router.get('/new', function(req, res){
    res.render('posts/new');
});

//write
router.post('/', function(req, res){
    req.body.author= req.user._id;
    Post.create(req.body, function(err, post){
        if(err) return res.json(err);
        res.redirect('/posts');
    });
});

//show
router.get('/:id',function(req, res){
    Post.findOne({_id:req.params.id})
        .populate('author')
        .exec(function(err, post){
            if(err) return res.json(err);
        res.render('posts/show', {post:post});
    });
});

//수정페이지 연결
router.get('/:id/edit', function(req, res){
    Post.findOne({_id:req.params.id}, req.body, function(err, post){
        if(err) return res.json(err);
        res.render('posts/edit', {post:post});
    });
});
//수정
router.put('/:id', function(req, res){
    req.body.updatedAt = Date.now();
    Post.findByIdAndUpdate({_id:req.params.id}, req.body, function(err, post){
        if(err) return res.json(err);
        res.redirect("/posts/"+req.params.id);
    
    });
});
//delete
router.delete('/:id', function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
        if(err) return res.json(err);
        res.redirect('/posts');
    });
});

module.exports = router;