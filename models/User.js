const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//schema
const userSchema = mongoose.Schema({
    username:{type:String, required:[true, '아이디를 입력해주세요!'], unique:true},
    password:{type:String, required:[true, '비밀번호를 입력해주세요!'], select:false},
    name:{type:String, required:[true, '이름을 입력해주세요!']},
    email:{type:String}
},{
    toObject:{virtuals:true}
});

//virtuals : 회원가입, 회원정보 수정을 위해 필요하지만 db에는 저장할 필요없는 값을 확인하고 정의
userSchema.virtual('passwordConfirm')
    .get(function(){return this._passwordComfirm;})
    .set(function(value){this._passwordComfirm=value;});

userSchema.virtual('originalPassword')
    .get(function(){return this._orginalPassword;})
    .set(function(value){this._orginalPassword;});

userSchema.virtual('currentPassword')
    .get(function(){return this._currentPassword;})
    .set(function(value){this._currentPassword;});

userSchema.virtual('newPassword')
    .get(function(){return this._newPassword;})
    .set(function(value){this._newPassword;});

//password validation
userSchema.path('password').validate(function (v) {
    const user = this;

    if (user.isNew) {
        if (!user.passwordComfirm) {
            (!user.invalidate('passwordConfirm', '비밀번호 확인을 입력해주세요'));
        }

        if (user.password !== user.passwordComfirm) {
            user.invalidate('passwordConfirm', '비밀번호 확인이 일치하지 않습니다.');
        }
    }
    //정보수정
    if(!user.isNew){
        if(!user.currentPassword){
            user.invalidate('currentPassword','현재비빌번호를 입력해주세요');
        }else if(!bcrypt.compareSync(user.currentPassword ,user.originalPassword)){
            user.invalidate('currentPassword','현재비밀번호가 틀렸습니다.');
        }
        if(user.newPassword !== user.passwordComfirm){
            user.invalidate('passwordConfirm', '비밀번호 확인이 일치하지 않습니다.');
        }
    }
});

userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }else{
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
});

userSchema.methods.authenticate = function (password){
    const user = this;
    return bcrypt.compareSync(password, user.password);
}
const User = mongoose.model('user', userSchema);
module.exports = User;