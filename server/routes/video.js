const express = require('express');
const router = express.Router();
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');
const { auth } = require("../middleware/auth");

//Storage multer config
let storage = multer.diskStorage({
    destination:(req, file, cf)=>{
        cf(null, "uploads/");
    },
    filename:(req, file, cf)=>{
        cf(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter : (req, file, cf)=>{
        const ext = path.extname(file.originalname)
        if(ext !=='.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cf(null, true)
    }
});

const upload = multer({storage:storage}).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res)=>{  //req는 클라이언트에서 보내준 파일
    //비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err){
            return res.json({success:false, err})   //실패하면 false를 반환
        }
        return res.json({success:true, 
            url:res.req.file.path,  //path랑 
            fileName: res.req.file.filename //filename을 못찾는데 왜지 ..? multer 키값인데.....
        });  //성공하면 파일경로, 파일 이름 클라이언트로 보내줌
    })
    
})

router.post('/thumbnail', (req, res)=>{  //req는 클라이언트에서 보내준 파일

    let filePath = "";
    let fileDuration = "";
    //비디오 러닝타임 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.log(metadata)
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    });
    //썸네일 생성

    ffmpeg(req.body.url)  //uploads경로에 있는 url을 클라이언트에서 받아옴?!
    .on('filenames', function(filenames){  //섬네일 파일 이름 생성 
        console.log("Will generate" + filenames.join(','))
        console.log(filenames)

        filePath = "uploads/thumbnails/" +filenames[0]
    })
    .on('end', function(){
        console.log('Screenshots taken');
        return res.json({success: true, url:filePath,  fileDuration:fileDuration}) //url(클라이언트로 보내는 값) : filePath(라이브러리 자체에서 꺼내서 주는 값)
    })
    .on('error', function(err){
        console.log(err);
        return res.json({success:false, err});
    })
    .screenshots({
        count :3,
        folder:'uploads/thumbnails',
        size:'320x240',    //*안됨 x 이거 넣어줘야 함 !
        filename:'thumbnail-%b.png'
    })
})

module.exports = router;