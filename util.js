const util = {};

//functions 몽구스와 몽고디비에서 나는 에러의 형ㅌ태가 다르기 때문에 에러의 형태를 통일시켜준다 {항목이름 : {message : "에러메세지"}}
util.parseError = function(errors){
    const parsed = {};
    if(errors.name == 'ValidationError'){
        for(let name in errors.errors){
            const ValidationError = errors.errors[name];
            parsed[name] = {message:ValidationError.message};
        }
    }
    else if(errors.code == '11000'&& errors.errmsg.indexOf('username') > 0){
        parsed.username = {message : '이미존재하는 아이디 입니다.'};
    }
    else{
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
}

util.isLoggedin = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('errors', {login :'로그인 먼저 해주세요'});
        res.redirect('/login');
    }
}

util.noPermission = function(req, res){
    req.flsah('errors', {login:"권한이 없습니다."});
    req.logout();
    res.redirect('/login');
}


module.exports = util;