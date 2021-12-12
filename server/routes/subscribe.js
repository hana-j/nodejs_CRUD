const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber')
//const { auth } = require("../middleware/auth");


//=================================
//             Subscribe
//=================================

router.post('/subscribeNumber', (req, res)=>{  //req는 클라이언트에서 보내준 파일
    
    Subscriber.find({'useTo':req.body.userTo})
        .exec((err, subscribe)=>{
            if(err) return res.status(400).send(err);
            return res.status(200).json({success:true, subscribeNumber : subscribe.length})
        })
    
})

router.post('/subsribed', (req, res)=>{  //req는 클라이언트에서 보내준 파일
    
    Subscriber.find({'userTo':req.body.userTo, 'userFrom': req.body.userFrom})
        .exec((err, subscribe)=>{
            if(err) return res.status(400).send(err);
            let result = false  // 구독을 안하는거
            if(subscribe.length !== 0){
                result =true  //구독하는거 
            }
            res.status(200).json({success : true, subscribe:result});
        })    
})

module.exports = router;